import { copyFile, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { runPlanFromStart } from "../../src/runner.js";
import type { Plan } from "../../src/types/plan.js";

const thisFilePath = fileURLToPath(import.meta.url);
const realRobotPackageFolder = path.resolve(path.dirname(thisFilePath), "../..");
const fixturesImagesDir = path.join(realRobotPackageFolder, "tests/fixtures/images");

// ---------------------------------------------------------------------------
// Workspace helpers
// ---------------------------------------------------------------------------

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

/**
 * Creates an isolated temp workspace with a minimal `robot/` layout and copies
 * all fixture PNGs into it so image tasks can resolve paths within `repoRootFolder`.
 */
async function createWorkspace(): Promise<{
  repoRootFolder: string;
  robotPackageFolder: string;
}> {
  const repoRootFolder = await mkdtemp(path.join(os.tmpdir(), "robot-image-e2e-"));
  tempRoots.push(repoRootFolder);
  const robotPackageFolder = path.join(repoRootFolder, "robot");
  await mkdir(path.join(robotPackageFolder, "plans"), { recursive: true });

  const fixturesTarget = path.join(repoRootFolder, "robot/tests/fixtures/images");
  await mkdir(fixturesTarget, { recursive: true });
  for (const name of ["white", "black", "red", "blue", "green", "yellow"]) {
    await copyFile(
      path.join(fixturesImagesDir, `${name}.example.png`),
      path.join(fixturesTarget, `${name}.example.png`),
    );
  }

  return { repoRootFolder, robotPackageFolder };
}

async function writePlan(
  robotPackageFolder: string,
  planId: string,
  plan: Plan,
): Promise<void> {
  const filePath = path.join(robotPackageFolder, "plans", `${planId}.json`);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
}

// ---------------------------------------------------------------------------
// Image assertion helpers
// ---------------------------------------------------------------------------

/** Returns the RGBA value of a single pixel at (x, y). */
async function readPixel(
  imagePath: string,
  x: number,
  y: number,
): Promise<[number, number, number, number]> {
  const { data } = await sharp(imagePath)
    .extract({ left: x, top: y, width: 1, height: 1 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return [data[0], data[1], data[2], data[3]];
}

/** Returns `{ width, height }` of an image. */
async function imageSize(imagePath: string): Promise<{ width: number; height: number }> {
  const { width, height } = await sharp(imagePath).metadata();
  if (!width || !height) {
    throw new Error(`Could not read dimensions of ${imagePath}`);
  }
  return { width, height };
}

// ---------------------------------------------------------------------------
// Expected fixture pixel values (verified from tests/fixtures/images/*.example.png)
// ---------------------------------------------------------------------------
//   white:  rgba(255, 255, 255, 255)
//   black:  rgba(  0,   0,   0, 255)
//   red:    rgba(130,   0,   0, 255)
//   blue:   rgba(  0,  22, 130, 255)
//   green:  rgba(  4, 112,   0, 255)
//   yellow: rgba(130, 129,   0, 255)

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("image E2E", () => {
  describe("image.create-bridge", () => {
    it("composites left/right crops with a transparent center band", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const outputPath = path.join(repoRootFolder, "robot/tests/e2e/.output/bridge.png");

      await writePlan(robotPackageFolder, "bridge", {
        recipeId: "examples/images/create-bridge",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "image.create-bridge",
            title: "Create bridge",
            arguments: {
              leftImageFile: "robot/tests/fixtures/images/white.example.png",
              rightImageFile: "robot/tests/fixtures/images/black.example.png",
              outputImageFile: "robot/tests/e2e/.output/bridge.png",
              leftCropWidth: 33,
              rightCropWidth: 33,
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "bridge", repoRootFolder, robotPackageFolder });

      // Output matches the input tile dimensions
      expect(await imageSize(outputPath)).toEqual({ width: 100, height: 100 });

      // Left crop (white right edge, columns 0–32): fully opaque white
      expect(await readPixel(outputPath, 16, 50)).toEqual([255, 255, 255, 255]);

      // Center band (columns 33–66): fully transparent
      // centerWidth = 100 - 33 - 33 = 34  →  center occupies columns 33..66
      expect(await readPixel(outputPath, 50, 50)).toEqual([0, 0, 0, 0]);

      // Right crop (black left edge, columns 67–99): fully opaque black
      // rightCrop placed at left = 33 + 34 = 67
      expect(await readPixel(outputPath, 83, 50)).toEqual([0, 0, 0, 255]);
    });
  });

  describe("image.compose-tiles", () => {
    it("lays six tiles side by side into a horizontal strip", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const outputPath = path.join(repoRootFolder, "robot/tests/e2e/.output/strip.png");

      await writePlan(robotPackageFolder, "strip", {
        recipeId: "examples/images/compose-tiles",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "image.compose-tiles",
            title: "Compose tiles",
            arguments: {
              inputImages: [
                "robot/tests/fixtures/images/white.example.png",
                "robot/tests/fixtures/images/yellow.example.png",
                "robot/tests/fixtures/images/green.example.png",
                "robot/tests/fixtures/images/red.example.png",
                "robot/tests/fixtures/images/blue.example.png",
                "robot/tests/fixtures/images/black.example.png",
              ],
              outputImageFile: "robot/tests/e2e/.output/strip.png",
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "strip", repoRootFolder, robotPackageFolder });

      // Strip is 6×100 wide and tile-height tall
      expect(await imageSize(outputPath)).toEqual({ width: 600, height: 100 });

      // Sample the center of each 100px tile section
      expect(await readPixel(outputPath,  50, 50)).toEqual([255, 255, 255, 255]); // white
      expect(await readPixel(outputPath, 150, 50)).toEqual([130, 129,   0, 255]); // yellow
      expect(await readPixel(outputPath, 250, 50)).toEqual([  4, 112,   0, 255]); // green
      expect(await readPixel(outputPath, 350, 50)).toEqual([130,   0,   0, 255]); // red
      expect(await readPixel(outputPath, 450, 50)).toEqual([  0,  22, 130, 255]); // blue
      expect(await readPixel(outputPath, 550, 50)).toEqual([  0,   0,   0, 255]); // black
    });
  });

  describe("image.assemble-layers", () => {
    it("stacks layers with correct position, blend mode, and opacity", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const outputPath = path.join(repoRootFolder, "robot/tests/e2e/.output/assembled.png");

      // Red as base at middle-center, blue at bottom-right with multiply + 50% opacity.
      // Canvas width overridden to 200; height = max(100, 100) = 100.
      await writePlan(robotPackageFolder, "assembled", {
        recipeId: "examples/images/assemble-layers",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "image.assemble-layers",
            title: "Assemble layers",
            arguments: {
              inputs: [
                "robot/tests/fixtures/images/red.example.png",
                {
                  imageFile: "robot/tests/fixtures/images/blue.example.png",
                  position: "bottom-right",
                  blend: "multiply",
                  opacity: 0.5,
                },
              ],
              output: {
                imageFile: "robot/tests/e2e/.output/assembled.png",
                format: "png",
                width: 200,
              },
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "assembled", repoRootFolder, robotPackageFolder });

      // Output: 200×100 (width overridden, height = max tile height)
      expect(await imageSize(outputPath)).toEqual({ width: 200, height: 100 });

      // Columns 0–49: nothing placed here → transparent
      // (red centered at left=round((200-100)/2)=50)
      expect(await readPixel(outputPath, 25, 50)).toEqual([0, 0, 0, 0]);

      // Columns 50–99: red-only region (red centered, no blue overlap yet)
      // (blue at bottom-right starts at left=200-100=100)
      expect(await readPixel(outputPath, 75, 50)).toEqual([130, 0, 0, 255]);

      // Columns 100–149: overlap — red base + blue at 50% opacity with multiply blend
      // multiply(red, blue) = 0 on all channels; blend brings red down proportionally
      // Result empirically verified: rgba(64, 0, 0, 255)
      expect(await readPixel(outputPath, 125, 50)).toEqual([64, 0, 0, 255]);

      // Columns 150–199: blue-only at 50% opacity over transparent canvas
      // alpha = round(255 × 0.5) = 128; color preserved
      expect(await readPixel(outputPath, 175, 50)).toEqual([0, 22, 130, 128]);
    });
  });
});
