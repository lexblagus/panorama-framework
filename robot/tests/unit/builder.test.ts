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
  repoRootFolder: string;
  robotPackageFolder: string;
  recipesRoot: string;
}> {
  const repoRootFolder = await createTempRoot();
  const robotPackageFolder = path.join(repoRootFolder, "robot");
  const recipesRoot = path.join(robotPackageFolder, "src", "recipes");
  await mkdir(recipesRoot, { recursive: true });
  return { repoRootFolder, robotPackageFolder, recipesRoot };
}

describe("buildCommand", () => {
  it("builds plan from flat recipe file and writes waiting tasks", async () => {
    const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
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
        '      arguments: { file: "robot/tests/.tmp/a.json", value: { ok: true } },',
        "    },",
        "  ],",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    const result = await buildCommand({
      recipeId: "smoke-test",
      repoRootFolder,
      robotPackageFolder,
      recipesRoot,
    });

    const planPath = path.join(robotPackageFolder, "plans", "smoke-test.json");
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
    const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
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
      repoRootFolder,
      robotPackageFolder,
      recipesRoot,
    });

    const planPath = path.join(robotPackageFolder, "plans", "minimal.json");
    const plan = JSON.parse(await readFile(planPath, "utf8")) as Plan;
    expect(plan.tasks).toHaveLength(1);
    expect(plan.tasks[0].arguments).toMatchObject({
      marker: "robot:preview-table-first-row",
    });
  });

  it("builds nested recipe id and writes nested plan path", async () => {
    const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
    const nestedFolder = path.join(recipesRoot, "examples");
    await mkdir(nestedFolder, { recursive: true });
    await writeFile(
      path.join(nestedFolder, "empty.mjs"),
      [
        "export default {",
        '  title: "Empty Nested",',
        "  steps: [],",
        "};",
        "",
      ].join("\n"),
      "utf8",
    );

    const result = await buildCommand({
      recipeId: "examples/empty",
      repoRootFolder,
      robotPackageFolder,
      recipesRoot,
    });

    const planPath = path.join(robotPackageFolder, "plans", "examples", "empty.json");
    const plan = JSON.parse(await readFile(planPath, "utf8")) as Plan;

    expect(result.recipeId).toBe("examples/empty");
    expect(result.planId).toBe("examples/empty");
    expect(plan.recipeId).toBe("examples/empty");
    expect(plan.tasks).toHaveLength(0);
  });

  it("resolves recipe from legacy robot/recipes root", async () => {
    const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
    const legacyRecipesRoot = path.join(robotPackageFolder, "recipes", "examples");
    await mkdir(legacyRecipesRoot, { recursive: true });
    await writeFile(
      path.join(legacyRecipesRoot, "legacy-empty.ts"),
      [
        "const recipe = {",
        '  title: "Legacy Empty",',
        "  steps: [],",
        "};",
        "export default recipe;",
        "",
      ].join("\n"),
      "utf8",
    );

    const result = await buildCommand({
      recipeId: "examples/legacy-empty",
      repoRootFolder,
      robotPackageFolder,
      recipesRoot,
    });

    expect(result.recipeId).toBe("examples/legacy-empty");
    expect(result.planId).toBe("examples/legacy-empty");
  });

  it("rejects invalid runtime recipe id", async () => {
    const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
    await expect(
      buildCommand({
        recipeId: ".bad",
        repoRootFolder,
        robotPackageFolder,
        recipesRoot,
      }),
    ).rejects.toThrow('Invalid recipeId: ".bad"');
  });

  it("fails when recipe cannot be resolved", async () => {
    const { repoRootFolder, robotPackageFolder, recipesRoot } = await createWorkspace();
    await expect(
      buildCommand({
        recipeId: "missing",
        repoRootFolder,
        robotPackageFolder,
        recipesRoot,
      }),
    ).rejects.toThrow('Recipe not found: "missing"');
  });
});
