import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { runPlanFromStart } from "../../src/runner.js";
import type { Plan } from "../../src/types/plan.js";

const thisFilePath = fileURLToPath(import.meta.url);
const realRobotPackageFolder = path.resolve(path.dirname(thisFilePath), "../..");
const fixturesMarkdownDir = path.join(realRobotPackageFolder, "tests/fixtures/markdown");

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
  const repoRootFolder = await mkdtemp(path.join(os.tmpdir(), "robot-markdown-e2e-"));
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

/**
 * Copies the insert fixture into the temp workspace and returns the repo-relative path.
 * Each test gets its own workspace, so concurrent runs never share the same file.
 */
async function setupInsertFixture(repoRootFolder: string): Promise<string> {
  const relativePath = "robot/tests/e2e/.output/insert.md";
  const absolutePath = path.join(repoRootFolder, relativePath);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(
    absolutePath,
    await readFile(path.join(fixturesMarkdownDir, "insert.example.md"), "utf8"),
    "utf8",
  );
  return relativePath;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("markdown E2E", () => {
  describe("markdown.read", () => {
    it("reads a valid markdown fixture without error", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();

      const fixtureTarget = path.join(repoRootFolder, "robot/tests/fixtures/markdown/read.example.md");
      await mkdir(path.dirname(fixtureTarget), { recursive: true });
      await writeFile(
        fixtureTarget,
        await readFile(path.join(fixturesMarkdownDir, "read.example.md"), "utf8"),
        "utf8",
      );

      await writePlan(robotPackageFolder, "read", {
        recipeId: "examples/markdown/read",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.read",
            title: "Read markdown",
            arguments: { file: "robot/tests/fixtures/markdown/read.example.md" },
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
        recipeId: "examples/markdown/read",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.read",
            title: "Read missing",
            arguments: { file: "robot/tests/fixtures/markdown/does-not-exist.md" },
            state: "waiting",
          },
        ],
      });

      let threw = false;
      try {
        await runPlanFromStart({ planId: "read-missing", repoRootFolder, robotPackageFolder });
      } catch {
        threw = true;
      }

      expect(threw).toBe(true);
      const plan = await readPlan(robotPackageFolder, "read-missing");
      expect(plan.tasks[0].state).toBe("error");
      expect(plan.tasks[0].errorMessage).toBeTruthy();
    });
  });

  describe("markdown.write", () => {
    it("writes content to a new file", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const outRelative = "robot/tests/e2e/.output/written.md";

      await writePlan(robotPackageFolder, "write", {
        recipeId: "examples/markdown/write",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.write",
            title: "Write markdown",
            arguments: {
              file: outRelative,
              content: "# Generated\n\nHello from robot.\n",
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "write", repoRootFolder, robotPackageFolder });

      const result = await readFile(path.join(repoRootFolder, outRelative), "utf8");
      expect(result).toBe("# Generated\n\nHello from robot.\n");
    });

    it("overwrites an existing file with new content", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const outRelative = "robot/tests/e2e/.output/overwrite.md";
      const outAbsolute = path.join(repoRootFolder, outRelative);

      await mkdir(path.dirname(outAbsolute), { recursive: true });
      await writeFile(outAbsolute, "# Stale content\n", "utf8");

      await writePlan(robotPackageFolder, "overwrite", {
        recipeId: "examples/markdown/write",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.write",
            title: "Overwrite",
            arguments: { file: outRelative, content: "# Fresh content\n" },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "overwrite", repoRootFolder, robotPackageFolder });

      const result = await readFile(outAbsolute, "utf8");
      expect(result).toBe("# Fresh content\n");
    });
  });

  describe("markdown.insert", () => {
    it("inserts content before a marker", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const mdPath = await setupInsertFixture(repoRootFolder);

      await writePlan(robotPackageFolder, "insert-before", {
        recipeId: "examples/markdown/insert",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.insert",
            title: "Insert before",
            arguments: {
              file: mdPath,
              marker: "robot:content-before",
              content: "***inserted before***",
              position: "before",
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "insert-before", repoRootFolder, robotPackageFolder });

      const result = await readFile(path.join(repoRootFolder, mdPath), "utf8");
      // Content appears immediately before the marker on its own line
      expect(result).toContain("***inserted before***\n<!-- robot:content-before -->");
    });

    it("inserts content after a marker", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const mdPath = await setupInsertFixture(repoRootFolder);

      await writePlan(robotPackageFolder, "insert-after", {
        recipeId: "examples/markdown/insert",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.insert",
            title: "Insert after",
            arguments: {
              file: mdPath,
              marker: "robot:content-after",
              content: "***inserted after***",
              position: "after",
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "insert-after", repoRootFolder, robotPackageFolder });

      const result = await readFile(path.join(repoRootFolder, mdPath), "utf8");
      // Content appears on the line immediately following the marker
      expect(result).toContain("<!-- robot:content-after -->\n***inserted after***");
    });

    it("replaces the marker itself with content (over)", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const mdPath = await setupInsertFixture(repoRootFolder);

      await writePlan(robotPackageFolder, "insert-over", {
        recipeId: "examples/markdown/insert",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.insert",
            title: "Insert over",
            arguments: {
              file: mdPath,
              marker: "robot:content-over",
              content: "***inserted over***",
              position: "over",
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "insert-over", repoRootFolder, robotPackageFolder });

      const result = await readFile(path.join(repoRootFolder, mdPath), "utf8");
      expect(result).toContain("***inserted over***");
      expect(result).not.toContain("<!-- robot:content-over -->");
    });

    it("replaces content between two markers (between)", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const mdPath = await setupInsertFixture(repoRootFolder);

      await writePlan(robotPackageFolder, "insert-between", {
        recipeId: "examples/markdown/insert",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.insert",
            title: "Insert between",
            arguments: {
              file: mdPath,
              marker: ["robot:content-between-before", "robot:content-between-after"],
              content: "***inserted between***",
              position: "between",
            },
            state: "waiting",
          },
        ],
      });

      await runPlanFromStart({ planId: "insert-between", repoRootFolder, robotPackageFolder });

      const result = await readFile(path.join(repoRootFolder, mdPath), "utf8");
      // New content sits between the two markers; original content is gone
      expect(result).toContain("<!-- robot:content-between-before -->\n***inserted between***\n<!-- robot:content-between-after -->");
      expect(result).not.toContain("original content");
    });

    it("records an error when the insert marker is not found", async () => {
      const { repoRootFolder, robotPackageFolder } = await createWorkspace();
      const mdPath = await setupInsertFixture(repoRootFolder);

      await writePlan(robotPackageFolder, "insert-missing-marker", {
        recipeId: "examples/markdown/insert",
        createdAt: new Date().toISOString(),
        tasks: [
          {
            taskId: "markdown.insert",
            title: "Insert missing marker",
            arguments: {
              file: mdPath,
              marker: "robot:does-not-exist",
              content: "***should not appear***",
              position: "after",
            },
            state: "waiting",
          },
        ],
      });

      let threw = false;
      try {
        await runPlanFromStart({
          planId: "insert-missing-marker",
          repoRootFolder,
          robotPackageFolder,
        });
      } catch {
        threw = true;
      }

      expect(threw).toBe(true);
      const plan = await readPlan(robotPackageFolder, "insert-missing-marker");
      expect(plan.tasks[0].state).toBe("error");
      expect(plan.tasks[0].errorMessage).toContain("marker not found");
    });
  });
});
