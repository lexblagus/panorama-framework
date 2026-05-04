import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { buildCommand } from "../../src/builder.js";
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
  const root = await mkdtemp(path.join(os.tmpdir(), "robot-builder-"));
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
  await mkdir(recipesRoot, { recursive: true });
  return { repoRoot, robotRoot, recipesRoot };
}

describe("buildCommand", () => {
  it("builds plan from flat recipe file and writes waiting tasks", async () => {
    const { repoRoot, robotRoot, recipesRoot } = await createWorkspace();
    const recipeFile = path.join(recipesRoot, "smoke-test.mjs");
    await writeFile(
      recipeFile,
      [
        "export default {",
        '  title: "Smoke Test",',
        "  steps: [",
        "    {",
        '      title: "Write file",',
        '      taskId: "json.write",',
        '      arguments: { path: "robot/tests/.tmp/a.json", value: { ok: true } },',
        "    },",
        "  ],",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    const result = await buildCommand({
      recipeId: "smoke-test",
      repoRoot,
      robotRoot,
      recipesRoot,
    });

    const planPath = path.join(robotRoot, "plans", "smoke-test.json");
    const plan = JSON.parse(await readFile(planPath, "utf8")) as Plan;

    expect(result.command).toBe("build");
    expect(result.recipeId).toBe("smoke-test");
    expect(result.planId).toBe("smoke-test");
    expect(result.taskCount).toBe(1);
    expect(plan.recipeId).toBe("smoke-test");
    expect(plan.tasks).toHaveLength(1);
    expect(plan.tasks[0].state).toBe("waiting");
    expect(plan.tasks[0].taskId).toBe("json.write");
  });

  it("loads folderized recipe config and uses buildRecipe function", async () => {
    const { repoRoot, robotRoot, recipesRoot } = await createWorkspace();
    const folder = path.join(recipesRoot, "minimal");
    await mkdir(folder, { recursive: true });
    await writeFile(
      path.join(folder, "config.json"),
      `${JSON.stringify({ marker: "robot:preview-table-first-row" }, null, 2)}\n`,
      "utf8",
    );
    await writeFile(
      path.join(folder, "index.mjs"),
      [
        "export async function buildRecipe(context) {",
        "  return {",
        '    title: "Minimal",',
        "    steps: [",
        "      {",
        '        title: "Insert marker",',
        '        taskId: "markdown.insert",',
        "        arguments: {",
        '          file: "images/PREVIEW.md",',
        "          marker: context.recipeConfig.marker,",
        '          content: "| test |",',
        "        },",
        "      },",
        "    ],",
        "  };",
        "}",
        "",
      ].join("\n"),
      "utf8",
    );

    await buildCommand({
      recipeId: "minimal",
      repoRoot,
      robotRoot,
      recipesRoot,
    });

    const planPath = path.join(robotRoot, "plans", "minimal.json");
    const plan = JSON.parse(await readFile(planPath, "utf8")) as Plan;
    expect(plan.tasks).toHaveLength(1);
    expect(plan.tasks[0].arguments).toMatchObject({
      marker: "robot:preview-table-first-row",
    });
  });

  it("rejects invalid runtime recipe id", async () => {
    const { repoRoot, robotRoot, recipesRoot } = await createWorkspace();
    await expect(
      buildCommand({
        recipeId: ".bad",
        repoRoot,
        robotRoot,
        recipesRoot,
      }),
    ).rejects.toThrow('Invalid recipeId: ".bad"');
  });

  it("fails when recipe cannot be resolved", async () => {
    const { repoRoot, robotRoot, recipesRoot } = await createWorkspace();
    await expect(
      buildCommand({
        recipeId: "missing",
        repoRoot,
        robotRoot,
        recipesRoot,
      }),
    ).rejects.toThrow('Recipe not found: "missing"');
  });
});
