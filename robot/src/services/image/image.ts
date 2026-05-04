import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export interface ImageServiceOptions {
  repoRoot: string;
}

export interface CreateBridgeArgs {
  leftImageFile: string;
  rightImageFile: string;
  outputImageFile: string;
  leftCropWidth: number;
  rightCropWidth: number;
}

export interface ComposeTilesPreviewArgs {
  inputImages: string[];
  outputImageFile: string;
}

interface RequiredImageMetadata {
  width: number;
  height: number;
}

function assertPositiveInteger(value: number, name: string): void {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }
}

export class ImageService {
  private readonly repoRoot: string;

  constructor(options: ImageServiceOptions) {
    this.repoRoot = options.repoRoot;
  }

  private resolveRepoPath(targetPath: string): string {
    if (path.isAbsolute(targetPath)) {
      return targetPath;
    }
    return path.join(this.repoRoot, targetPath);
  }

  private async readRequiredMetadata(filePath: string): Promise<RequiredImageMetadata> {
    const metadata = await sharp(filePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Image metadata missing dimensions for ${filePath}`);
    }
    return { width: metadata.width, height: metadata.height };
  }

  async createBridge(args: CreateBridgeArgs): Promise<{ outputImageFile: string }> {
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

    return { outputImageFile };
  }

  async composeTilesPreview(
    args: ComposeTilesPreviewArgs,
  ): Promise<{ outputImageFile: string }> {
    if (!Array.isArray(args.inputImages) || args.inputImages.length === 0) {
      throw new Error("inputImages must contain at least one image");
    }

    const absoluteInputImages = args.inputImages.map((input) =>
      this.resolveRepoPath(input)
    );
    const outputImageFile = this.resolveRepoPath(args.outputImageFile);

    const baseMeta = await this.readRequiredMetadata(absoluteInputImages[0]);
    const composites: Array<{ input: Buffer; left: number; top: number }> = [];

    for (let index = 0; index < absoluteInputImages.length; index += 1) {
      const imageFile = absoluteInputImages[index];
      const metadata = await this.readRequiredMetadata(imageFile);
      if (
        metadata.width !== baseMeta.width ||
        metadata.height !== baseMeta.height
      ) {
        throw new Error("All inputImages must have exactly the same dimensions");
      }

      const inputBuffer = await sharp(imageFile).ensureAlpha().toBuffer();
      composites.push({
        input: inputBuffer,
        left: baseMeta.width * index,
        top: 0,
      });
    }

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

    return { outputImageFile };
  }
}
