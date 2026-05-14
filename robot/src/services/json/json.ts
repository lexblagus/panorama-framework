import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { planSchema } from "../../types/plan.js";
import type { Plan } from "../../types/plan.js";
import { BaseService } from "../base/index.js";
import { ensureValidId } from "../../utils/shared.js";
import type {
  JsonServiceOptions,
  JsonWriteOptions,
  RecipeState,
  RobotGlobalConfig,
} from "./types.js";

function serializeJson(value: unknown, options?: JsonWriteOptions): string {
  const format = options?.format ?? "formatted";
  if (format === "compact") {
    return JSON.stringify(value);
  }
  return JSON.stringify(value, null, "\t\t");
}

async function atomicWriteFile(filePath: string, content: string): Promise<void> {
  const tmp = `${filePath}.tmp`;
  await writeFile(tmp, content, "utf8");
  await rename(tmp, filePath);
}

export class JsonService extends BaseService {
  constructor(options: JsonServiceOptions) {
    super(options);
  }

  async read<T>(targetPath: string): Promise<T> {
    const absolutePath = this.resolveRepoPath(targetPath);
    const raw = await readFile(absolutePath, "utf8");
    return JSON.parse(raw) as T;
  }

  async write(
    targetPath: string,
    value: unknown,
    options?: JsonWriteOptions,
  ): Promise<void> {
    const absolutePath = this.resolveRepoPath(targetPath);
    const serialized = serializeJson(value, options);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await atomicWriteFile(absolutePath, `${serialized}\n`);
  }

  async readGlobalConfig(): Promise<RobotGlobalConfig> {
    return this.read<RobotGlobalConfig>(this.resolveRobotPath("config.json"));
  }

  async readPlan(planId: string): Promise<Plan> {
    ensureValidId("planId", planId);
    const raw = await this.read<unknown>(this.resolveRobotPath("plans", `${planId}.json`));
    const result = planSchema.safeParse(raw);
    if (!result.success) {
      const detail = result.error.issues
        .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`Invalid plan "${planId}":\n${detail}`);
    }
    return result.data as Plan;
  }

  async writePlan(
    planId: string,
    plan: Plan,
    options?: JsonWriteOptions,
  ): Promise<void> {
    ensureValidId("planId", planId);
    await this.write(
      this.resolveRobotPath("plans", `${planId}.json`),
      plan,
      options,
    );
  }

  async readRecipeState(recipeId: string): Promise<RecipeState | null> {
    ensureValidId("recipeId", recipeId);
    try {
      return await this.read<RecipeState>(
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
    ensureValidId("recipeId", recipeId);
    await this.write(
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
