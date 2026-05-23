import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runPlanFromStart } from "../../src/runner.js";
import type { Plan } from "../../src/types/plan.js";

const thisFilePath = fileURLToPath(import.meta.url);
const realRobotPackageFolder = path.resolve(path.dirname(thisFilePath), "../..");
const fixturesJsonDir = path.join(realRobotPackageFolder, "tests/fixtures/json");

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
  const repoRootFolder = await mkdtemp(path.join(os.tmpdir(), "robot-json-e2e-"));
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

describe("json E2E", () => {
  describe("json.write", () => {
    it("writes a JSON value and formats it with indentation", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();

      await writePlan(robotPackageFolder, "write", {
        recipeId: "examples/json/write",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.write",
            title: "Write JSON",
            arguments: {
              file: "robot/tests/e2e/.output/write-output.json",
              value: { hello: "world", count: 42, nested: { ok: true } },
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "write", repoRootFolder, robotPackageFolder });

      const outputPath = path.join(
        repoRootFolder,
        "robot/tests/e2e/.output/write-output.json",
      );
      const raw = await readFile(outputPath, "utf8");
      const parsed = JSON.parse(raw) as unknown;

      expect(parsed).toEqual({ hello: "world", count: 42, nested: { ok: true } });
      // JsonService writes formatted JSON (double-tab indented) followed by a newline
      expect(raw.endsWith("\n")).toBe(true);
      expect(raw).toContain("\t\t");
    });

    it("creates parent directories automatically for nested output paths", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();

      await writePlan(robotPackageFolder, "write-nested", {
        recipeId: "examples/json/write",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.write",
            title: "Write nested",
            arguments: {
              file: "robot/tests/e2e/.output/deep/nested/dir/output.json",
              value: { deep: true },
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({
        planId: "write-nested",
        repoRootFolder,
        robotPackageFolder,
      });

      const outputPath = path.join(
        repoRootFolder,
        "robot/tests/e2e/.output/deep/nested/dir/output.json",
      );
      const parsed = JSON.parse(await readFile(outputPath, "utf8")) as unknown;
      expect(parsed).toEqual({ deep: true });
    });

    it("overwrites an existing file", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const outRelative = "robot/tests/e2e/.output/overwrite.json";
      const outAbsolute = path.join(repoRootFolder, outRelative);

      // Pre-create the file with stale content
      await mkdir(path.dirname(outAbsolute), { recursive: true });
      await writeFile(outAbsolute, JSON.stringify({ stale: true }), "utf8");

      await writePlan(robotPackageFolder, "overwrite", {
        recipeId: "examples/json/write",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.write",
            title: "Overwrite",
            arguments: { file: outRelative, value: { fresh: true } },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "overwrite", repoRootFolder, robotPackageFolder });

      const parsed = JSON.parse(await readFile(outAbsolute, "utf8")) as unknown;
      expect(parsed).toEqual({ fresh: true });
    });
  });

  describe("json.read", () => {
    it("reads a valid JSON fixture without error", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();

      // Copy the fixture into the temp workspace so the path resolves within repoRootFolder
      const fixtureTarget = path.join(
        repoRootFolder,
        "robot/tests/fixtures/json/read.example.json",
      );
      await mkdir(path.dirname(fixtureTarget), { recursive: true });
      await writeFile(
        fixtureTarget,
        await readFile(path.join(fixturesJsonDir, "read.example.json"), "utf8"),
        "utf8",
      );

      await writePlan(robotPackageFolder, "read", {
        recipeId: "examples/json/read",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.read",
            title: "Read JSON",
            arguments: { path: "robot/tests/fixtures/json/read.example.json" },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "read", repoRootFolder, robotPackageFolder });

      const plan = await readPlan(robotPackageFolder, "read");
      expect(plan.tasks[0].state).toBe("success");
    });

    it("records an error when the target file does not exist", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();

      await writePlan(robotPackageFolder, "read-missing", {
        recipeId: "examples/json/read",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.read",
            title: "Read missing",
            arguments: { path: "robot/tests/fixtures/json/does-not-exist.json" },
            state: "waiting",
          },
        ],
      });

      let threw = false;
      try {
        await runPlanFromStart({
          planId: "read-missing",
          repoRootFolder,
          robotPackageFolder,
        });
      } catch {
        threw = true;
      }

      expect(threw).toBe(true);
      const plan = await readPlan(robotPackageFolder, "read-missing");
      expect(plan.tasks[0].state).toBe("error");
      expect(plan.tasks[0].errorMessage).toBeTruthy();
    });
  });
});
