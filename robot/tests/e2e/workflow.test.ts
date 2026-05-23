import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runPlanFromStart } from "../../src/runner.js";
import type { Plan } from "../../src/types/plan.js";

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
  recipesRoot: string;
}> {
  const repoRootFolder = await mkdtemp(path.join(os.tmpdir(), "robot-workflow-e2e-"));
  tempRoots.push(repoRootFolder);
  const robotPackageFolder = path.join(repoRootFolder, "robot");
  const recipesRoot = path.join(robotPackageFolder, "src", "recipes");
  await mkdir(path.join(robotPackageFolder, "plans"), { recursive: true });
  await mkdir(recipesRoot, { recursive: true });
  return { repoRootFolder, robotPackageFolder, recipesRoot };
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

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Child recipe factories
// ---------------------------------------------------------------------------

/**
 * Writes a minimal child recipe (ES module `.mjs`) that runs a single `json.write`
 * task, producing a file at the given repo-relative output path.
 */
async function writeChildRecipe(
  recipesRoot: string,
  recipeId: string,
  outputRelativePath: string,
): Promise<void> {
  const recipeFile = path.join(recipesRoot, `${recipeId}.mjs`);
  await mkdir(path.dirname(recipeFile), { recursive: true });
  await writeFile(
    recipeFile,
    [
      "export default {",
      `  title: "Child ${recipeId}",`,
      "  steps: [",
      "    {",
      `      title: "Write child output",`,
      '      taskId: "json.write",',
      `      arguments: { file: ${JSON.stringify(outputRelativePath)}, value: { child: true } },`,
      "    },",
      "  ],",
      "};",
      "",
    ].join("\n"),
    "utf8",
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("workflow E2E", () => {
  describe("workflow.run-recipe", () => {
    it("mode: exec — builds and runs a child recipe end-to-end", async () => {
      const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
      const childOutput = "robot/tests/e2e/.output/child-exec.json";

      await writeChildRecipe(recipesRoot, "child-exec", childOutput);

      await writePlan(robotPackageFolder, "parent-exec", {
        recipeId: "parent-exec",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "workflow.run-recipe",
            title: "Exec child recipe",
            arguments: { mode: "exec", recipeId: "child-exec" },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({
        planId: "parent-exec",
        repoRootFolder,
        robotPackageFolder,
        recipesRoot,
      });

      // Child plan should have been written and executed
      const childPlan = await readPlan(robotPackageFolder, "child-exec");
      expect(childPlan.tasks[0].state).toBe("success");

      // Side-effect: child's json.write task produced the output file
      const outputAbsolute = path.join(repoRootFolder, childOutput);
      expect(JSON.parse(await readFile(outputAbsolute, "utf8"))).toEqual({ child: true });
    });

    it("mode: build — builds a child plan without executing it", async () => {
      const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
      const childOutput = "robot/tests/e2e/.output/child-build.json";

      await writeChildRecipe(recipesRoot, "child-build", childOutput);

      await writePlan(robotPackageFolder, "parent-build", {
        recipeId: "parent-build",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "workflow.run-recipe",
            title: "Build child recipe",
            arguments: { mode: "build", recipeId: "child-build" },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({
        planId: "parent-build",
        repoRootFolder,
        robotPackageFolder,
        recipesRoot,
      });

      // Child plan file should exist with all tasks still in waiting state
      const childPlan = await readPlan(robotPackageFolder, "child-build");
      expect(childPlan.tasks).toHaveLength(1);
      expect(childPlan.tasks[0].state).toBe("waiting");

      // No execution means no output file
      expect(await fileExists(path.join(repoRootFolder, childOutput))).toBe(false);
    });

    it("mode: run — runs an existing child plan from start", async () => {
      const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
      const childOutput = "robot/tests/e2e/.output/child-run.json";

      // Pre-write the child plan (simulates a prior build step)
      await writePlan(robotPackageFolder, "child-run", {
        recipeId: "child-run",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.write",
            title: "Write child output",
            arguments: { file: childOutput, value: { child: true } },
            state: "waiting",
          },
        ],
      });

      await writePlan(robotPackageFolder, "parent-run", {
        recipeId: "parent-run",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "workflow.run-recipe",
            title: "Run child plan",
            arguments: { mode: "run", planId: "child-run" },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({
        planId: "parent-run",
        repoRootFolder,
        robotPackageFolder,
        recipesRoot,
      });

      const childPlan = await readPlan(robotPackageFolder, "child-run");
      expect(childPlan.tasks[0].state).toBe("success");
      expect(JSON.parse(await readFile(path.join(repoRootFolder, childOutput), "utf8"))).toEqual({
        child: true,
      });
    });

    it("mode: resume — resumes a child plan that was halted at workflow.stop", async () => {
      const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
      const step1Output = "robot/tests/e2e/.output/child-resume-step1.json";
      const step3Output = "robot/tests/e2e/.output/child-resume-step3.json";

      // Pre-write a child plan that already completed step 1 and stopped at step 2
      await writePlan(robotPackageFolder, "child-resume", {
        recipeId: "child-resume",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.write",
            title: "Step 1 (already done)",
            arguments: { file: step1Output, value: { step: 1 } },
            state: "success",
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
          },
          {
            taskId: "workflow.stop",
            title: "Stop",
            arguments: {},
            state: "error",
            errorMessage: "workflow.stop: execution halted intentionally",
            startedAt: new Date().toISOString(),
            finishedAt: new Date().toISOString(),
          },
          {
            taskId: "json.write",
            title: "Step 3 (pending)",
            arguments: { file: step3Output, value: { step: 3 } },
            state: "waiting",
          },
        ],
      });

      await writePlan(robotPackageFolder, "parent-resume", {
        recipeId: "parent-resume",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "workflow.run-recipe",
            title: "Resume child plan",
            arguments: { mode: "resume", planId: "child-resume" },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({
        planId: "parent-resume",
        repoRootFolder,
        robotPackageFolder,
        recipesRoot,
      });

      // workflow.stop was auto-skipped on resume; step 3 ran
      const childPlan = await readPlan(robotPackageFolder, "child-resume");
      expect(childPlan.tasks[0].state).toBe("success"); // kept
      expect(childPlan.tasks[1].state).toBe("success"); // auto-skipped
      expect(childPlan.tasks[2].state).toBe("success"); // executed

      expect(JSON.parse(await readFile(path.join(repoRootFolder, step3Output), "utf8"))).toEqual({
        step: 3,
      });
    });
  });

  describe("workflow.stop", () => {
    it("halts the plan, records error state, and causes the runner to throw", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const step1Output = "robot/tests/e2e/.output/stop-step1.json";
      const step3Output = "robot/tests/e2e/.output/stop-step3.json";

      await writePlan(robotPackageFolder, "stop-test", {
        recipeId: "stop-test",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "json.write",
            title: "Step 1",
            arguments: { file: step1Output, value: { step: 1 } },
            state: "waiting",
          },
          {
            taskId: "workflow.stop",
            title: "Intentional stop",
            arguments: {},
            state: "waiting",
          },
          {
            taskId: "json.write",
            title: "Step 3 (should not run)",
            arguments: { file: step3Output, value: { step: 3 } },
            state: "waiting",
          },
        ],
      });

      let threw = false;
      try {
        await runPlanFromStart({ planId: "stop-test", repoRootFolder, robotPackageFolder });
      } catch {
        threw = true;
      }

      expect(threw).toBe(true);

      const plan = await readPlan(robotPackageFolder, "stop-test");
      expect(plan.tasks[0].state).toBe("success");
      expect(plan.tasks[1].state).toBe("error");
      expect(plan.tasks[1].errorMessage).toContain("workflow.stop");
      expect(plan.tasks[2].state).toBe("waiting");

      // Step 1 ran, step 3 did not
      expect(JSON.parse(await readFile(path.join(repoRootFolder, step1Output), "utf8"))).toEqual({
        step: 1,
      });
      expect(await fileExists(path.join(repoRootFolder, step3Output))).toBe(false);
    });
  });
});
