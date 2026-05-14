import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { BaseService } from "../base/index.js";
import type {
  ComposeTilesPreviewArgs,
  CreateBridgeArgs,
  ImageServiceOptions,
} from "./types.js";

interface RequiredImageMetadata {
  width: number;
  height: number;
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

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
}
