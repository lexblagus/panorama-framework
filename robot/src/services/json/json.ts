import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plan } from "../../types/plan.js";
import { BaseService } from "../base/index.js";
import type {
  JsonServiceOptions,
  JsonWriteOptions,
  RecipeState,
  RobotGlobalConfig,
} from "./types.js";

const ID_SEGMENT_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

function serializeJson(value: unknown, options?: JsonWriteOptions): string {
  const format = options?.format ?? "formatted";
  if (format === "compact") {
    return JSON.stringify(value);
  }

  return JSON.stringify(value, null, "\t\t");
}

export class JsonService extends BaseService {
  constructor(options: JsonServiceOptions) {
    super(options);
  }

  private ensureValidId(kind: "planId" | "recipeId", value: string): void {
    if (value.startsWith("/") || value.endsWith("/") || value.includes("//")) {
      throw new Error(`Invalid ${kind}: "${value}"`);
    }
    const segments = value.split("/");
    if (segments.length === 0) {
      throw new Error(`Invalid ${kind}: "${value}"`);
    }
    for (const segment of segments) {
      if (
        segment.length === 0 ||
        segment === "." ||
        segment === ".." ||
        !ID_SEGMENT_PATTERN.test(segment)
      ) {
        throw new Error(`Invalid ${kind}: "${value}"`);
      }
    }
    if (path.isAbsolute(value)) {
      throw new Error(`Invalid ${kind}: "${value}"`);
    }
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
