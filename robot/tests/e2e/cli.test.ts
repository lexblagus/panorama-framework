import { execFile } from "node:child_process";
import { access, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

const thisFilePath = fileURLToPath(import.meta.url);
const robotPackageFolder = path.resolve(path.dirname(thisFilePath), "../..");
const distIndexJs = path.join(robotPackageFolder, "dist", "index.js");
const planFile = path.join(robotPackageFolder, "plans", "examples", "cli-e2e.json");
const step1OutputFile = path.join(robotPackageFolder, "transient", "e2e-cli-step1.json");
const step3OutputFile = path.join(robotPackageFolder, "transient", "e2e-cli-step3.json");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function spawnCli(
  args: string[],
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync(process.execPath, [distIndexJs, ...args]);
    return { exitCode: 0, stdout, stderr };
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; code?: number };
    return {
      exitCode: e.code ?? 1,
      stdout: e.stdout ?? "",
      stderr: e.stderr ?? "",
    };
  }
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
// Setup
// ---------------------------------------------------------------------------

/** Build once before all CLI tests so `dist/index.js` is up to date. */
beforeAll(async () => {
  await execFileAsync("npm", ["run", "build"], { cwd: robotPackageFolder });
}, 60_000);

/** Remove all artifacts written by the cli-e2e recipe before each test. */
beforeEach(async () => {
  await rm(planFile, { force: true });
  await rm(step1OutputFile, { force: true });
  await rm(step3OutputFile, { force: true });
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CLI E2E", () => {
  describe("argument parsing", () => {
    it("prints usage and exits 0 on --help", async () => {
      const { exitCode, stdout } = await spawnCli(["--help"]);
      expect(exitCode).toBe(0);
      expect(stdout).toContain("Usage:");
    });

    it("exits 1 on unknown subcommand", async () => {
      const { exitCode, stderr } = await spawnCli(["foobar", "--recipe", "examples/cli-e2e"]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain("Unknown subcommand");
    });

    it("exits 1 when --recipe is missing for build", async () => {
      const { exitCode, stderr } = await spawnCli(["build"]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain("Missing required flag: --recipe");
    });

    it("exits 1 when --plan is missing for run", async () => {
      const { exitCode, stderr } = await spawnCli(["run"]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain("Missing required flag: --plan");
    });

    it("exits 1 when --plan is passed to build", async () => {
      const { exitCode, stderr } = await spawnCli(["build", "--plan", "examples/cli-e2e"]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain("--plan");
    });

    it("exits 1 when recipe is not found", async () => {
      const { exitCode, stderr } = await spawnCli(["exec", "--recipe", "examples/does-not-exist"]);
      expect(exitCode).toBe(1);
      expect(stderr).toContain("Recipe not found");
    });
  });

  describe("build", () => {
    it("creates plan with all tasks in waiting state", async () => {
      const { exitCode } = await spawnCli(["build", "--recipe", "examples/cli-e2e"]);
      expect(exitCode).toBe(0);

      const plan = JSON.parse(await readFile(planFile, "utf8")) as {
        tasks: { state: string; taskId: string }[];
      };
      expect(plan.tasks).toHaveLength(3);
      expect(plan.tasks.every((t) => t.state === "waiting")).toBe(true);
      expect(plan.tasks[0].taskId).toBe("json.write");
      expect(plan.tasks[1].taskId).toBe("workflow.stop");
      expect(plan.tasks[2].taskId).toBe("json.write");
      expect(await fileExists(step1OutputFile)).toBe(false);
    });
  });

  describe("exec", () => {
    it("runs until workflow.stop and exits non-zero", async () => {
      const { exitCode } = await spawnCli(["exec", "--recipe", "examples/cli-e2e"]);
      expect(exitCode).not.toBe(0);

      expect(JSON.parse(await readFile(step1OutputFile, "utf8"))).toEqual({ step: 1 });
      expect(await fileExists(step3OutputFile)).toBe(false);

      const plan = JSON.parse(await readFile(planFile, "utf8")) as {
        tasks: { state: string }[];
      };
      expect(plan.tasks[0].state).toBe("success");
      expect(plan.tasks[1].state).toBe("error");
      expect(plan.tasks[2].state).toBe("waiting");
    });
  });

  describe("run", () => {
    it("runs existing plan from start, stops at workflow.stop", async () => {
      await spawnCli(["build", "--recipe", "examples/cli-e2e"]);

      const { exitCode } = await spawnCli(["run", "--plan", "examples/cli-e2e"]);
      expect(exitCode).not.toBe(0);

      expect(JSON.parse(await readFile(step1OutputFile, "utf8"))).toEqual({ step: 1 });
      expect(await fileExists(step3OutputFile)).toBe(false);
    });

    it("exits non-zero when plan does not exist", async () => {
      const { exitCode } = await spawnCli(["run", "--plan", "examples/cli-e2e"]);
      expect(exitCode).not.toBe(0);
    });
  });

  describe("resume", () => {
    it("auto-skips workflow.stop and completes remaining tasks", async () => {
      // First exec: runs step 1, fails at step 2 (workflow.stop)
      await spawnCli(["exec", "--recipe", "examples/cli-e2e"]);

      const { exitCode } = await spawnCli(["resume", "--plan", "examples/cli-e2e"]);
      expect(exitCode).toBe(0);

      expect(JSON.parse(await readFile(step3OutputFile, "utf8"))).toEqual({ step: 3 });

      const plan = JSON.parse(await readFile(planFile, "utf8")) as {
        tasks: { state: string }[];
      };
      expect(plan.tasks[0].state).toBe("success");
      expect(plan.tasks[1].state).toBe("success"); // auto-skipped on resume
      expect(plan.tasks[2].state).toBe("success");
    });
  });
});
