import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plan } from "../../types/plan.js";

export type JsonWriteFormat = "formatted" | "compact";

export interface JsonWriteOptions {
  format?: JsonWriteFormat;
}

export interface JsonServiceOptions {
  repoRoot: string;
  robotRoot: string;
}

export type RobotGlobalConfig = Record<string, unknown>;
export type RecipeState = Record<string, unknown>;

const ID_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

function serializeJson(value: unknown, options?: JsonWriteOptions): string {
  const format = options?.format ?? "formatted";
  if (format === "compact") {
    return JSON.stringify(value);
  }

  return JSON.stringify(value, null, "\t\t");
}

export class JsonService {
  private readonly repoRoot: string;
  private readonly robotRoot: string;

  constructor(options: JsonServiceOptions) {
    this.repoRoot = options.repoRoot;
    this.robotRoot = options.robotRoot;
  }

  private ensureValidId(kind: "planId" | "recipeId", value: string): void {
    if (!ID_PATTERN.test(value)) {
      throw new Error(`Invalid ${kind}: "${value}"`);
    }
  }

  private resolveRepoPath(targetPath: string): string {
    if (path.isAbsolute(targetPath)) {
      return targetPath;
    }
    return path.join(this.repoRoot, targetPath);
  }

  private resolveRobotPath(...segments: string[]): string {
    return path.join(this.robotRoot, ...segments);
  }

  async readJson<T>(targetPath: string): Promise<T> {
    const absolutePath = this.resolveRepoPath(targetPath);
    const raw = await readFile(absolutePath, "utf8");
    return JSON.parse(raw) as T;
  }

  async writeJson(
    targetPath: string,
    value: unknown,
    options?: JsonWriteOptions,
  ): Promise<void> {
    const absolutePath = this.resolveRepoPath(targetPath);
    const serialized = serializeJson(value, options);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, `${serialized}\n`, "utf8");
  }

  async read<T>(targetPath: string): Promise<T> {
    return this.readJson<T>(targetPath);
  }

  async write(
    targetPath: string,
    value: unknown,
    options?: JsonWriteOptions,
  ): Promise<void> {
    await this.writeJson(targetPath, value, options);
  }

  async readGlobalConfig(): Promise<RobotGlobalConfig> {
    return this.readJson<RobotGlobalConfig>(this.resolveRobotPath("config.json"));
  }

  async readPlan(planId: string): Promise<Plan> {
    this.ensureValidId("planId", planId);
    return this.readJson<Plan>(this.resolveRobotPath("plans", `${planId}.json`));
  }

  async writePlan(
    planId: string,
    plan: Plan,
    options?: JsonWriteOptions,
  ): Promise<void> {
    this.ensureValidId("planId", planId);
    await this.writeJson(
      this.resolveRobotPath("plans", `${planId}.json`),
      plan,
      options,
    );
  }

  async readRecipeState(recipeId: string): Promise<RecipeState | null> {
    this.ensureValidId("recipeId", recipeId);
    try {
      return await this.readJson<RecipeState>(
        this.resolveRobotPath("transient", `${recipeId}.state.json`),
      );
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "ENOENT"
      ) {
        return null;
      }
      throw error;
    }
  }

  async writeRecipeState(
    recipeId: string,
    value: RecipeState,
    options?: JsonWriteOptions,
  ): Promise<void> {
    this.ensureValidId("recipeId", recipeId);
    await this.writeJson(
      this.resolveRobotPath("transient", `${recipeId}.state.json`),
      value,
      options,
    );
  }

  async initializeRecipeState(
    recipeId: string,
    fallback: RecipeState,
    options?: JsonWriteOptions,
  ): Promise<RecipeState> {
    const existing = await this.readRecipeState(recipeId);
    if (existing) {
      return existing;
    }

    await this.writeRecipeState(recipeId, fallback, options);
    return fallback;
  }
}
