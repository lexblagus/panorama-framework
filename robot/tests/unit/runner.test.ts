import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { resumePlan, runPlanFromStart } from "../../src/runner.js";
import type { Plan } from "../../src/types/plan.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map(async (root) => {
      await rm(root, { recursive: true, force: true });
    }),
  );
});

async function createTempRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "robot-runner-"));
  tempRoots.push(root);
  return root;
}

async function createWorkspace(): Promise<{
  repoRoot: string;
  robotRoot: string;
  recipesRoot: string;
}> {
  const repoRoot = await createTempRoot();
  const robotRoot = path.join(repoRoot, "robot");
  const recipesRoot = path.join(robotRoot, "src", "recipes");
  await mkdir(path.join(robotRoot, "plans"), { recursive: true });
  await mkdir(recipesRoot, { recursive: true });
  return { repoRoot, robotRoot, recipesRoot };
}

async function writePlan(
  robotRoot: string,
  planId: string,
  plan: Plan,
): Promise<void> {
  const filePath = path.join(robotRoot, "plans", `${planId}.json`);
  await writeFile(filePath, `${JSON.stringify(plan, null, 2)}\n`, "utf8");
}

async function readPlan(robotRoot: string, planId: string): Promise<Plan> {
  const filePath = path.join(robotRoot, "plans", `${planId}.json`);
  return JSON.parse(await readFile(filePath, "utf8")) as Plan;
}

describe("runner", () => {
  it("run executes tasks from start and resets runtime fields", async () => {
    const { repoRoot, robotRoot } = await createWorkspace();
    const planId = "smoke-test";

    await writePlan(robotRoot, planId, {
      recipeId: "smoke-test",
      createdAt: "2026-05-04T00:00:00.000Z",
      tasks: [
        {
          taskId: "json.write",
          title: "Write output",
          arguments: {
            path: "robot/tests/.tmp/runner/run-output.json",
            value: { ok: true },
          },
          state: "error",
          errorMessage: "previous failure",
          startedAt: "2026-05-04T00:00:01.000Z",
          finishedAt: "2026-05-04T00:00:02.000Z",
        },
      ],
    });

    const result = await runPlanFromStart({ planId, repoRoot, robotRoot });
    const plan = await readPlan(robotRoot, planId);
    const outputFile = path.join(repoRoot, "robot/tests/.tmp/runner/run-output.json");
    const outputPayload = JSON.parse(await readFile(outputFile, "utf8")) as {
      ok: boolean;
    };

    expect(result.command).toBe("run");
    expect(result.taskCount).toBe(1);
    expect(result.completedTaskCount).toBe(1);
    expect(outputPayload.ok).toBe(true);
    expect(plan.tasks[0].state).toBe("success");
    expect(plan.tasks[0].errorMessage).toBeUndefined();
    expect(plan.tasks[0].startedAt).toBeTypeOf("string");
    expect(plan.tasks[0].finishedAt).toBeTypeOf("string");
  });

  it("resume skips success tasks and executes first non-success task", async () => {
    const { repoRoot, robotRoot } = await createWorkspace();
    const planId = "resume-case";
    const skippedOutput = path.join(repoRoot, "robot/tests/.tmp/runner/skipped.json");
    const resumedOutput = path.join(repoRoot, "robot/tests/.tmp/runner/resumed.json");

    await writePlan(robotRoot, planId, {
      recipeId: "resume-case",
      createdAt: "2026-05-04T00:00:00.000Z",
      tasks: [
        {
          taskId: "json.write",
          title: "Already done",
          arguments: {
            path: "robot/tests/.tmp/runner/skipped.json",
            value: { skipped: false },
          },
          state: "success",
          startedAt: "2026-05-04T00:00:01.000Z",
          finishedAt: "2026-05-04T00:00:02.000Z",
        },
        {
          taskId: "json.write",
          title: "Needs run",
          arguments: {
            path: "robot/tests/.tmp/runner/resumed.json",
            value: { resumed: true },
          },
          state: "waiting",
        },
      ],
    });

    const result = await resumePlan({ planId, repoRoot, robotRoot });
    const plan = await readPlan(robotRoot, planId);
    const resumedPayload = JSON.parse(await readFile(resumedOutput, "utf8")) as {
      resumed: boolean;
    };

    await expect(stat(skippedOutput)).rejects.toThrow();
    expect(resumedPayload.resumed).toBe(true);
    expect(plan.tasks[0].state).toBe("success");
    expect(plan.tasks[1].state).toBe("success");
    expect(result.command).toBe("resume");
    expect(result.completedTaskCount).toBe(2);
  });

  it("resume behaves like run when no runtime state exists", async () => {
    const { repoRoot, robotRoot } = await createWorkspace();
    const planId = "fresh-resume";
    const outputFile = path.join(repoRoot, "robot/tests/.tmp/runner/fresh.json");

    await writePlan(robotRoot, planId, {
      recipeId: "fresh-resume",
      createdAt: "2026-05-04T00:00:00.000Z",
      tasks: [
        {
          taskId: "json.write",
          title: "Write fresh",
          arguments: {
            path: "robot/tests/.tmp/runner/fresh.json",
            value: { fresh: true },
          },
          state: "waiting",
        },
      ],
    });

    const result = await resumePlan({ planId, repoRoot, robotRoot });
    const payload = JSON.parse(await readFile(outputFile, "utf8")) as { fresh: boolean };
    expect(result.command).toBe("resume");
    expect(result.completedTaskCount).toBe(1);
    expect(payload.fresh).toBe(true);
  });

  it("fails clearly when plan file does not exist", async () => {
    const { repoRoot, robotRoot } = await createWorkspace();
    await expect(
      runPlanFromStart({ planId: "missing", repoRoot, robotRoot }),
    ).rejects.toThrow('Plan not found: "missing"');
    await expect(
      resumePlan({ planId: "missing", repoRoot, robotRoot }),
    ).rejects.toThrow('Plan not found: "missing"');
  });

  it("dispatches workflow.run-recipe for nested exec", async () => {
    const { repoRoot, robotRoot, recipesRoot } = await createWorkspace();
    const childOutput = path.join(repoRoot, "robot/tests/.tmp/runner/workflow-child.json");
    const childRecipeFile = path.join(recipesRoot, "child.mjs");

    await writeFile(
      childRecipeFile,
      [
        "export default {",
        '  title: "Child Recipe",',
        "  steps: [",
        "    {",
        '      title: "Write child output",',
        '      taskId: "json.write",',
        '      arguments: { path: "robot/tests/.tmp/runner/workflow-child.json", value: { nested: true } },',
        "    },",
        "  ],",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    await writePlan(robotRoot, "parent", {
      recipeId: "parent",
      createdAt: "2026-05-04T00:00:00.000Z",
      tasks: [
        {
          taskId: "workflow.run-recipe",
          title: "Run child recipe",
          arguments: {
            mode: "exec",
            recipeId: "child",
          },
          state: "waiting",
        },
      ],
    });

    await runPlanFromStart({
      planId: "parent",
      repoRoot,
      robotRoot,
      recipesRoot,
    });

    const childPayload = JSON.parse(await readFile(childOutput, "utf8")) as {
      nested: boolean;
    };
    const childPlan = await readPlan(robotRoot, "child");
    expect(childPayload.nested).toBe(true);
    expect(childPlan.tasks[0].state).toBe("success");
  });
});
