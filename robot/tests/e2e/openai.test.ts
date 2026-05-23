import { mkdir, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { afterEach, describe, expect, it } from "vitest";
import { runPlanFromStart } from "../../src/runner.js";
import type { Plan } from "../../src/types/plan.js";
import { writeFile, readFile } from "node:fs/promises";

const thisFilePath = fileURLToPath(import.meta.url);
const realRobotPackageFolder = path.resolve(path.dirname(thisFilePath), "../..");

// ---------------------------------------------------------------------------
// Workspace helpers
// ---------------------------------------------------------------------------

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
  );
});

async function createWorkspace(): Promise<{
  repoRootFolder: string;
  robotPackageFolder: string;
}> {
  const repoRootFolder = await mkdtemp(path.join(os.tmpdir(), "robot-openai-e2e-"));
  tempRoots.push(repoRootFolder);
  const robotPackageFolder = path.join(repoRootFolder, "robot");
  await mkdir(path.join(robotPackageFolder, "plans"), { recursive: true });
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

async function readPlan(robotPackageFolder: string, planId: string): Promise<Plan> {
  const filePath = path.join(robotPackageFolder, "plans", `${planId}.json`);
  return JSON.parse(await readFile(filePath, "utf8")) as Plan;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("openai E2E", () => {
  /**
   * Always-run: verifies the runner correctly captures "OPENAI_API_KEY is required"
   * as a task error — no network call, no API key needed.
   */
  it("records a descriptive error in the plan when OPENAI_API_KEY is absent", async () => {
    const { repoRootFolder, robotPackageFolder } = await createWorkspace();

    const savedKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;

    try {
      await writePlan(robotPackageFolder, "no-key", {
        recipeId: "examples/open-ai/no-key",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "openai.generate-image",
            title: "Generate without key",
            arguments: {
              prompt: "A transparent square",
              outputDir: "robot/tests/e2e/.output/openai",
              outputFilePrefix: "no-key",
              model: "gpt-image-1-mini",
              size: "1024x1024",
              quality: "low",
            },
            state: "waiting",
          },
        ],
      });

      let threw = false;
      try {
        await runPlanFromStart({ planId: "no-key", repoRootFolder, robotPackageFolder });
      } catch {
        threw = true;
      }

      expect(threw).toBe(true);
      const plan = await readPlan(robotPackageFolder, "no-key");
      expect(plan.tasks[0].state).toBe("error");
      expect(plan.tasks[0].errorMessage).toContain("OPENAI_API_KEY");
    } finally {
      if (savedKey !== undefined) {
        process.env.OPENAI_API_KEY = savedKey;
      }
    }
  });

  /**
   * Network test — skipped when OPENAI_API_KEY is not set.
   *
   * Prompt and settings are chosen for maximum determinism:
   *   - `background: "transparent"` tells the API to produce a PNG with an alpha channel
   *   - A blank/empty prompt minimises generated content, so most pixels should be transparent
   *   - `gpt-image-1-mini` + `quality: "low"` keeps cost and latency as low as possible
   *
   * Assertions are deliberately lenient (mean alpha < 128) because AI output is never
   * pixel-perfect, but a transparent-background blank-image request should return a PNG
   * that is predominantly transparent.
   */
  describe.skipIf(!process.env.OPENAI_API_KEY)(
    "openai.generate-image (requires OPENAI_API_KEY)",
    () => {
      it(
        "generates a transparent PNG and writes it to the output directory",
        async () => {
          const { repoRootFolder, robotPackageFolder } = await createWorkspace();
          const outputRelDir = "robot/tests/e2e/.output/openai";

          await writePlan(robotPackageFolder, "gen-transparent", {
            recipeId: "examples/open-ai/generate-image",
            createdAt: new Date().toISOString(),
            tasks: [
              {
                taskId: "openai.generate-image",
                title: "Generate transparent square",
                arguments: {
                  prompt:
                    "A completely blank, empty, transparent square image. No content, no shapes, nothing at all.",
                  outputDir: outputRelDir,
                  outputFilePrefix: "transparent-square",
                  model: "gpt-image-1-mini",
                  size: "1024x1024",
                  n: 1,
                  quality: "low",
                  outputFormat: "png",
                  background: "transparent",
                  saveSidecarMetadataFile: false,
                },
                state: "waiting",
              },
            ],
          });

          await runPlanFromStart({
            planId: "gen-transparent",
            repoRootFolder,
            robotPackageFolder,
          });

          const plan = await readPlan(robotPackageFolder, "gen-transparent");
          expect(plan.tasks[0].state).toBe("success");

          // Locate the written PNG (no suffix since n=1)
          const outputPath = path.join(
            repoRootFolder,
            outputRelDir,
            "transparent-square.png",
          );

          // File is a valid PNG with the requested dimensions
          const metadata = await sharp(outputPath).metadata();
          expect(metadata.format).toBe("png");
          expect(metadata.width).toBe(1024);
          expect(metadata.height).toBe(1024);

          // Alpha channel is present (4 channels = RGBA)
          expect(metadata.channels).toBe(4);

          // The image is predominantly transparent: mean alpha well below half-opacity
          const stats = await sharp(outputPath).ensureAlpha().stats();
          const meanAlpha = stats.channels[3].mean;
          expect(meanAlpha).toBeLessThan(128);
        },
        120_000,
      );
    },
  );
});
