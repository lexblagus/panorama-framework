import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { ImageService } from "../../src/services/image/index.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map(async (root) => {
      await rm(root, { recursive: true, force: true });
    }),
  );
});

async function createTempRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "robot-image-service-"));
  tempRoots.push(root);
  return root;
}

async function createPng(
  file: string,
  width: number,
  height: number,
  color: { r: number; g: number; b: number; alpha: number },
): Promise<void> {
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: color,
    },
  })
    .png()
    .toFile(file);
}

describe("ImageService", () => {
  it("creates bridge image using right side of left image and left side of right image", async () => {
    const root = await createTempRoot();
    const service = new ImageService({ repoRoot: root, robotRoot: root });

    const left = path.join(root, "left.png");
    const right = path.join(root, "right.png");
    const output = path.join(root, "out", "bridge.png");

    await createPng(left, 4, 2, { r: 255, g: 0, b: 0, alpha: 1 });
    await createPng(right, 4, 2, { r: 0, g: 0, b: 255, alpha: 1 });

    await service.createBridge({
      leftImageFile: left,
      rightImageFile: right,
      outputImageFile: output,
      leftCropWidth: 1,
      rightCropWidth: 1,
    });

    const metadata = await sharp(output).metadata();
    expect(metadata.width).toBe(4);
    expect(metadata.height).toBe(2);

    const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
    const pixel = (x: number, y: number): [number, number, number, number] => {
      const offset = (y * info.width + x) * info.channels;
      return [
        data[offset],
        data[offset + 1],
        data[offset + 2],
        data[offset + 3],
      ];
    };

    expect(pixel(0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(3, 0)).toEqual([0, 0, 255, 255]);
    expect(pixel(1, 0)[3]).toBe(0);
    expect(pixel(2, 0)[3]).toBe(0);
  });

  it("rejects createBridge when input dimensions do not match", async () => {
    const root = await createTempRoot();
    const service = new ImageService({ repoRoot: root, robotRoot: root });

    const left = path.join(root, "left.png");
    const right = path.join(root, "right.png");
    const output = path.join(root, "out", "bridge.png");

    await createPng(left, 4, 2, { r: 255, g: 0, b: 0, alpha: 1 });
    await createPng(right, 5, 2, { r: 0, g: 0, b: 255, alpha: 1 });

    await expect(
      service.createBridge({
        leftImageFile: left,
        rightImageFile: right,
        outputImageFile: output,
        leftCropWidth: 1,
        rightCropWidth: 1,
      }),
    ).rejects.toThrow("Input images must have exactly the same dimensions");
  });

  it("composes tiles as row-only strip preserving order", async () => {
    const root = await createTempRoot();
    const service = new ImageService({ repoRoot: root, robotRoot: root });

    const tile1 = path.join(root, "tile1.png");
    const tile2 = path.join(root, "tile2.png");
    const tile3 = path.join(root, "tile3.png");
    const output = path.join(root, "out", "preview.png");

    await createPng(tile1, 2, 2, { r: 255, g: 0, b: 0, alpha: 1 });
    await createPng(tile2, 2, 2, { r: 0, g: 255, b: 0, alpha: 1 });
    await createPng(tile3, 2, 2, { r: 0, g: 0, b: 255, alpha: 1 });

    await service.composeTilesPreview({
      inputImages: [tile1, tile2, tile3],
      outputImageFile: output,
    });

    const metadata = await sharp(output).metadata();
    expect(metadata.width).toBe(6);
    expect(metadata.height).toBe(2);

    const { data, info } = await sharp(output).raw().toBuffer({ resolveWithObject: true });
    const pixel = (x: number): [number, number, number] => {
      const offset = x * info.channels;
      return [data[offset], data[offset + 1], data[offset + 2]];
    };

    expect(pixel(0)).toEqual([255, 0, 0]);
    expect(pixel(2)).toEqual([0, 255, 0]);
    expect(pixel(4)).toEqual([0, 0, 255]);
  });

  it("rejects composeTilesPreview when image sizes mismatch", async () => {
    const root = await createTempRoot();
    const service = new ImageService({ repoRoot: root, robotRoot: root });

    const tile1 = path.join(root, "tile1.png");
    const tile2 = path.join(root, "tile2.png");
    const output = path.join(root, "out", "preview.png");

    await createPng(tile1, 2, 2, { r: 255, g: 0, b: 0, alpha: 1 });
    await createPng(tile2, 3, 2, { r: 0, g: 255, b: 0, alpha: 1 });

    await expect(
      service.composeTilesPreview({
        inputImages: [tile1, tile2],
        outputImageFile: output,
      }),
    ).rejects.toThrow("All inputImages must have exactly the same dimensions");
  });

  it("writes output file to disk", async () => {
    const root = await createTempRoot();
    const service = new ImageService({ repoRoot: root, robotRoot: root });
    const tile1 = path.join(root, "tile1.png");
    const output = path.join(root, "out", "preview.png");

    await createPng(tile1, 2, 2, { r: 255, g: 0, b: 0, alpha: 1 });
    await service.composeTilesPreview({ inputImages: [tile1], outputImageFile: output });

    const bytes = await readFile(output);
    expect(bytes.length).toBeGreaterThan(0);
  });
});
