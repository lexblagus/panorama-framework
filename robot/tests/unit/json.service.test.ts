import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { JsonService } from "../../src/services/json/index.js";
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
  const root = await mkdtemp(path.join(os.tmpdir(), "robot-json-service-"));
  tempRoots.push(root);
  return root;
}

async function createService(): Promise<{
  root: string;
  robotRoot: string;
  service: JsonService;
}> {
  const root = await createTempRoot();
  const robotRoot = path.join(root, "robot");
  const service = new JsonService({ repoRoot: root, robotRoot });
  return { root, robotRoot, service };
}

describe("JsonService", () => {
  it("writes formatted output by default", async () => {
    const { service, root } = await createService();
    const file = path.join(root, "formatted.json");

    await service.write(file, { a: 1, b: { c: true } });
    const contents = await readFile(file, "utf8");

    expect(contents).toContain("\n\t\t\"a\": 1,");
    expect(contents).toContain("\n\t\t\"b\": {");
    expect(contents).toContain("\n\t\t\t\t\"c\": true");
    expect(contents.endsWith("\n")).toBe(true);
  });

  it("writes compact output when requested", async () => {
    const { service, root } = await createService();
    const file = path.join(root, "compact.json");

    await service.write(file, { a: 1, b: { c: true } }, { format: "compact" });
    const contents = await readFile(file, "utf8");

    expect(contents).toBe('{"a":1,"b":{"c":true}}\n');
  });

  it("reads and writes JSON using repo-root relative paths", async () => {
    const { service } = await createService();

    await service.writeJson("data/sample.json", { ok: true });
    const loaded = await service.readJson<{ ok: boolean }>("data/sample.json");

    expect(loaded).toEqual({ ok: true });
  });

  it("reads global config from robot/config.json", async () => {
    const { service, robotRoot } = await createService();

    await service.writeJson(path.join(robotRoot, "config.json"), { env: "test" });
    const config = await service.readGlobalConfig();

    expect(config).toEqual({ env: "test" });
  });

  it("writes and reads plan files by plan id", async () => {
    const { service, robotRoot } = await createService();
    const plan: Plan = {
      recipeId: "smoke-test",
      createdAt: "2026-05-03T00:00:00Z",
      tasks: [],
    };

    await service.writePlan("smoke-test", plan);
    const loaded = await service.readPlan("smoke-test");
    const contents = await readFile(
      path.join(robotRoot, "plans", "smoke-test.json"),
      "utf8",
    );

    expect(loaded).toEqual(plan);
    expect(contents).toContain('"recipeId": "smoke-test"');
  });

  it("rejects invalid plan ids", async () => {
    const { service } = await createService();
    const plan: Plan = {
      recipeId: "smoke-test",
      createdAt: "2026-05-03T00:00:00Z",
      tasks: [],
    };

    await expect(service.writePlan("../bad", plan)).rejects.toThrow(
      'Invalid planId: "../bad"',
    );
  });

  it("returns null for missing recipe state", async () => {
    const { service } = await createService();
    const state = await service.readRecipeState("generate-panorama");
    expect(state).toBeNull();
  });

  it("writes and reads recipe state by recipe id", async () => {
    const { service, robotRoot } = await createService();
    const payload = { fileIndex: 17 };

    await service.writeRecipeState("generate-panorama", payload);
    const loaded = await service.readRecipeState("generate-panorama");
    const contents = await readFile(
      path.join(robotRoot, "transient", "generate-panorama.state.json"),
      "utf8",
    );

    expect(loaded).toEqual(payload);
    expect(contents).toContain('"fileIndex": 17');
  });

  it("initializes recipe state from fallback when state does not exist", async () => {
    const { service } = await createService();
    const initialized = await service.initializeRecipeState(
      "generate-panorama",
      { fileIndex: 120 },
    );
    const loaded = await service.readRecipeState("generate-panorama");

    expect(initialized).toEqual({ fileIndex: 120 });
    expect(loaded).toEqual({ fileIndex: 120 });
  });

  it("preserves existing recipe state during fallback initialization", async () => {
    const { service } = await createService();
    await service.writeRecipeState("generate-panorama", { fileIndex: 130 });

    const initialized = await service.initializeRecipeState(
      "generate-panorama",
      { fileIndex: 1 },
    );

    expect(initialized).toEqual({ fileIndex: 130 });
  });
});
