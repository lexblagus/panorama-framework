import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { BaseService } from "../base/index.js";
import type {
  AssembleLayersArgs,
  AssembleLayersBlend,
  AssembleLayersInput,
  AssembleLayersPosition,
  ComposeTilesPreviewArgs,
  CreateBridgeArgs,
  ImageServiceOptions,
} from "./types.js";

interface RequiredImageMetadata {
  width: number;
  height: number;
}

function resolvePositionOffset(
  position: AssembleLayersPosition,
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
): { left: number; top: number } {
  const [vert, horiz] = position.split("-");
  const left =
    horiz === "left"   ? 0
    : horiz === "right"  ? canvasWidth - imageWidth
    : Math.round((canvasWidth - imageWidth) / 2);
  const top =
    vert === "top"    ? 0
    : vert === "bottom" ? canvasHeight - imageHeight
    : Math.round((canvasHeight - imageHeight) / 2);
  return { left, top };
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

/** Service for Sharp-based image composition operations used in the panorama pipeline. */
export class ImageService extends BaseService {
  constructor(options: ImageServiceOptions) {
    super(options);
  }

  private async readRequiredMetadata(filePath: string): Promise<RequiredImageMetadata> {
    const metadata = await sharp(filePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Image metadata missing dimensions for ${filePath}`);
    }
    return { width: metadata.width, height: metadata.height };
  }

  /**
   * Composites a transparent bridge image from two adjacent tiles: the right edge of the left
   * tile and the left edge of the right tile are placed on opposite sides of a transparent center
   * band, all within a canvas that matches the original tile dimensions.
   */
  async createBridge(args: CreateBridgeArgs): Promise<{ outputImageFile: string }> {
    this.log("info", `Creating bridge image...`);
    assertPositiveInteger(args.leftCropWidth, "leftCropWidth");
    assertPositiveInteger(args.rightCropWidth, "rightCropWidth");

    const leftImageFile = this.resolveRepoPath(args.leftImageFile);
    const rightImageFile = this.resolveRepoPath(args.rightImageFile);
    const outputImageFile = this.resolveRepoPath(args.outputImageFile);

    const leftMeta = await this.readRequiredMetadata(leftImageFile);
    const rightMeta = await this.readRequiredMetadata(rightImageFile);

    if (
      leftMeta.width !== rightMeta.width ||
      leftMeta.height !== rightMeta.height
    ) {
      throw new Error("Input images must have exactly the same dimensions");
    }

    if (args.leftCropWidth > leftMeta.width) {
      throw new Error("leftCropWidth must not exceed image width");
    }
    if (args.rightCropWidth > leftMeta.width) {
      throw new Error("rightCropWidth must not exceed image width");
    }

    const centerWidth = leftMeta.width - args.leftCropWidth - args.rightCropWidth;
    if (centerWidth <= 0) {
      throw new Error("leftCropWidth + rightCropWidth must be less than image width");
    }

    const leftCrop = await sharp(leftImageFile)
      .ensureAlpha()
      .extract({
        left: leftMeta.width - args.leftCropWidth,
        top: 0,
        width: args.leftCropWidth,
        height: leftMeta.height,
      })
      .toBuffer();

    const rightCrop = await sharp(rightImageFile)
      .ensureAlpha()
      .extract({
        left: 0,
        top: 0,
        width: args.rightCropWidth,
        height: leftMeta.height,
      })
      .toBuffer();

    await mkdir(path.dirname(outputImageFile), { recursive: true });

    await sharp({
      create: {
        width: leftMeta.width,
        height: leftMeta.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        { input: leftCrop, top: 0, left: 0 },
        { input: rightCrop, top: 0, left: args.leftCropWidth + centerWidth },
      ])
      .png()
      .toFile(outputImageFile);

    this.log("info", `Bridge image created: ${path.basename(outputImageFile)}`);
    return { outputImageFile };
  }

  /** Lays out all input tiles side-by-side into a single wide PNG preview strip. */
  async composeTilesPreview(
    args: ComposeTilesPreviewArgs,
  ): Promise<{ outputImageFile: string }> {
    this.log("info", `Composing tiles preview (${args.inputImages?.length ?? 0} tiles)...`);
    if (!Array.isArray(args.inputImages) || args.inputImages.length === 0) {
      throw new Error("inputImages must contain at least one image");
    }

    const absoluteInputImages = args.inputImages.map((input) =>
      this.resolveRepoPath(input)
    );
    const outputImageFile = this.resolveRepoPath(args.outputImageFile);

    // Pass 1: read all metadata and validate dimensions before loading any pixel data
    const allMeta = await Promise.all(absoluteInputImages.map((f) => this.readRequiredMetadata(f)));
    const baseMeta = allMeta[0];
    for (let i = 1; i < allMeta.length; i++) {
      if (allMeta[i].width !== baseMeta.width || allMeta[i].height !== baseMeta.height) {
        throw new Error(
          `Image "${absoluteInputImages[i]}" dimensions ${allMeta[i].width}×${allMeta[i].height} differ from base ${baseMeta.width}×${baseMeta.height}`,
        );
      }
    }

    // Pass 2: load all pixel buffers (all dimensions confirmed equal)
    const composites = await Promise.all(
      absoluteInputImages.map(async (imageFile, index) => ({
        input: await sharp(imageFile).ensureAlpha().toBuffer(),
        left: baseMeta.width * index,
        top: 0,
      })),
    );

    await mkdir(path.dirname(outputImageFile), { recursive: true });

    await sharp({
      create: {
        width: baseMeta.width * absoluteInputImages.length,
        height: baseMeta.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(composites)
      .png()
      .toFile(outputImageFile);

    this.log("info", `Tiles preview created: ${path.basename(outputImageFile)}`);
    return { outputImageFile };
  }

  /**
   * Stacks images as transparent layers on a single canvas.
   * First input is the background; last input is the foreground (highest z-index).
   * Canvas size is the bounding box of all inputs unless overridden by output.width/height.
   */
  async assembleLayers(args: AssembleLayersArgs): Promise<{ outputImageFile: string }> {
    this.log("info", `Assembling layers (${args.inputs?.length ?? 0} inputs)...`);

    if (!Array.isArray(args.inputs) || args.inputs.length === 0) {
      throw new Error("inputs must contain at least one image");
    }

    const normalized = args.inputs.map((input) =>
      typeof input === "string"
        ? { imageFile: this.resolveRepoPath(input), position: "middle-center" as AssembleLayersPosition, blend: "over" as AssembleLayersBlend, opacity: 1 }
        : { imageFile: this.resolveRepoPath(input.imageFile), position: input.position ?? "middle-center" as AssembleLayersPosition, blend: input.blend ?? "over" as AssembleLayersBlend, opacity: input.opacity ?? 1 },
    );

    const outputImageFile = this.resolveRepoPath(args.output.imageFile);
    const format = args.output.format ?? "png";

    const allMeta = await Promise.all(normalized.map((n) => this.readRequiredMetadata(n.imageFile)));

    const canvasWidth  = args.output.width  ?? Math.max(...allMeta.map((m) => m.width));
    const canvasHeight = args.output.height ?? Math.max(...allMeta.map((m) => m.height));

    const composites = await Promise.all(
      normalized.map(async (input, i) => {
        const { left, top } = resolvePositionOffset(
          input.position,
          canvasWidth,
          canvasHeight,
          allMeta[i].width,
          allMeta[i].height,
        );

        // Apply opacity by directly scaling each pixel's alpha channel value
        let buffer: Buffer;
        if (input.opacity < 1) {
          const opacity = Math.max(0, Math.min(1, input.opacity));
          const { data, info } = await sharp(input.imageFile)
            .ensureAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true });
          for (let px = 3; px < data.length; px += 4) {
            data[px] = Math.round(data[px] * opacity);
          }
          buffer = await sharp(Buffer.from(data), {
            raw: { width: info.width, height: info.height, channels: 4 },
          }).png().toBuffer();
        } else {
          buffer = await sharp(input.imageFile).ensureAlpha().toBuffer();
        }

        return { input: buffer, left, top, blend: input.blend as sharp.Blend };
      }),
    );

    await mkdir(path.dirname(outputImageFile), { recursive: true });

    const pipeline = sharp({
      create: {
        width: canvasWidth,
        height: canvasHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    }).composite(composites);

    if (format === "jpeg") {
      await pipeline.jpeg().toFile(outputImageFile);
    } else if (format === "webp") {
      await pipeline.webp().toFile(outputImageFile);
    } else {
      await pipeline.png().toFile(outputImageFile);
    }

    this.log("info", `Layers assembled: ${path.basename(outputImageFile)}`);
    return { outputImageFile };
  }
}
