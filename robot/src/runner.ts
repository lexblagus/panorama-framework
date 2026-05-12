import { fileURLToPath } from "node:url";
import path from "node:path";
import Log from "./log.js";
import { buildCommand } from "./builder.js";
import { ImageService } from "./services/image/index.js";
import { JsonService } from "./services/json/index.js";
import { MarkdownService } from "./services/markdown/index.js";
import type {
  MarkdownInsertMarker,
  MarkdownInsertPosition,
} from "./services/markdown/index.js";
import { OpenAIService } from "./services/openai/index.js";
import { WorkflowService, type RunRecipeArgs } from "./services/workflow/index.js";
import type { Plan } from "./types/plan.js";
import type {
  ResumeInput,
  RunnerResult,
  RunFromStartInput,
} from "./types/runner.js";
import type { Task } from "./types/task.js";

const log = new Log("runner", "red");

const ID_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

interface RunnerPaths {
  repoRootFolder: string;
  robotPackageFolder: string;
  recipesRoot: string;
}

interface ServiceRegistry {
  json: JsonService;
  markdown: MarkdownService;
  image: ImageService;
  openai: OpenAIService;
  workflow: WorkflowService;
}

interface ExecutePlanOptions {
  planId: string;
  command: "run" | "resume";
  plan: Plan;
  services: ServiceRegistry;
  skipSuccessfulTasks: boolean;
  resetBeforeRun: boolean;
}

function ensureValidPlanId(planId: string): void {
  if (
    path.isAbsolute(planId) ||
    planId.startsWith("/") ||
    planId.endsWith("/") ||
    planId.includes("//")
  ) {
    throw new Error(`Invalid planId: "${planId}"`);
  }
  const segments = planId.split("/");
  if (segments.length === 0) {
    throw new Error(`Invalid planId: "${planId}"`);
  }
  for (const segment of segments) {
    if (
      segment.length === 0 ||
      segment === "." ||
      segment === ".." ||
      !ID_PATTERN.test(segment)
    ) {
      throw new Error(`Invalid planId: "${planId}"`);
    }
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function resolveRunnerPaths(input: RunFromStartInput | ResumeInput): RunnerPaths {
  const robotPackageFolderFromSource = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const robotPackageFolder = path.resolve(
    input.robotPackageFolder ?? robotPackageFolderFromSource,
  );
  const repoRootFolder = path.resolve(
    input.repoRootFolder ?? path.join(robotPackageFolder, ".."),
  );
  const recipesRoot = path.resolve(
    input.recipesRoot ?? path.join(robotPackageFolder, "src", "recipes"),
  );
  return {
    repoRootFolder,
    robotPackageFolder,
    recipesRoot,
  };
}

function isPlanMissingError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}

async function loadPlanOrThrow(json: JsonService, planId: string): Promise<Plan> {
  try {
    return await json.readPlan(planId);
  } catch (error: unknown) {
    if (isPlanMissingError(error)) {
      throw new Error(`Plan not found: "${planId}"`);
    }
    throw error;
  }
}

function resetTask(task: Task): void {
  task.state = "waiting";
  delete task.errorMessage;
  delete task.startedAt;
  delete task.finishedAt;
}

function hasPersistedRuntimeState(plan: Plan): boolean {
  return plan.tasks.some((task) =>
    task.state !== "waiting" ||
    task.errorMessage !== undefined ||
    task.startedAt !== undefined ||
    task.finishedAt !== undefined
  );
}

function getStringArgument(argumentsValue: Record<string, unknown>, key: string): string {
  const value = argumentsValue[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Task argument "${key}" must be a non-empty string`);
  }
  return value;
}

function getObjectArgument(
  argumentsValue: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const value = argumentsValue[key];
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(`Task argument "${key}" must be an object`);
  }
  return value as Record<string, unknown>;
}

async function dispatchTask(task: Task, services: ServiceRegistry): Promise<void> {
  switch (task.taskId) {
    case "json.read": {
      const targetPath = getStringArgument(task.arguments, "path");
      await services.json.read(targetPath);
      return;
    }
    case "json.write": {
      const targetPath = getStringArgument(task.arguments, "file");
      const value = task.arguments.value;
      await services.json.write(targetPath, value);
      return;
    }
    case "markdown.read": {
      const targetPath = (
        typeof task.arguments.targetPath === "string" &&
        task.arguments.targetPath.trim() !== ""
      )
        ? task.arguments.targetPath
        : getStringArgument(task.arguments, "file");
      await services.markdown.read(targetPath);
      return;
    }
    case "markdown.write": {
      const file = getStringArgument(task.arguments, "file");
      const content = getStringArgument(task.arguments, "content");
      await services.markdown.write(file, content);
      return;
    }
    case "markdown.insert": {
      const file = getStringArgument(task.arguments, "file");
      const content = getStringArgument(task.arguments, "content");
      const rawPosition = task.arguments.position;
      let position: MarkdownInsertPosition | undefined;
      if (rawPosition !== undefined) {
        const parsed = getStringArgument(task.arguments, "position");
        if (
          parsed !== "before" &&
          parsed !== "over" &&
          parsed !== "after" &&
          parsed !== "between"
        ) {
          throw new Error(
            'Task argument "position" must be one of: before, over, after, between',
          );
        }
        position = parsed;
      }
      let marker: MarkdownInsertMarker;
      if (position === "between") {
        const rawMarker = task.arguments.marker;
        if (!Array.isArray(rawMarker) || rawMarker.length !== 2) {
          throw new Error(
            'Task argument "marker" must be [startMarker, endMarker] when position is "between"',
          );
        }
        const [startMarker, endMarker] = rawMarker;
        if (
          typeof startMarker !== "string" ||
          !startMarker.trim() ||
          typeof endMarker !== "string" ||
          !endMarker.trim()
        ) {
          throw new Error(
            'Task argument "marker" must be [startMarker, endMarker] when position is "between"',
          );
        }
        marker = [startMarker, endMarker];
      } else {
        marker = getStringArgument(task.arguments, "marker");
      }
      await services.markdown.insert({ file, marker, content, position });
      return;
    }
    case "image.create-bridge":
      await services.image.createBridge(
        task.arguments as unknown as Parameters<ImageService["createBridge"]>[0],
      );
      return;
    case "image.compose-tiles":
      await services.image.composeTilesPreview(
        task.arguments as unknown as Parameters<ImageService["composeTilesPreview"]>[0],
      );
      return;
    case "openai.generate-image":
      await services.openai.generateImage(
        task.arguments as unknown as Parameters<OpenAIService["generateImage"]>[0],
      );
      return;
    case "workflow.run-recipe": {
      const args = (
        "runRecipe" in task.arguments
          ? getObjectArgument(task.arguments, "runRecipe")
          : task.arguments
      ) as RunRecipeArgs;
      await services.workflow.runRecipe(args);
      return;
    }
    case "openai.edit-image":
    case "openai.respond":
      throw new Error(`Task not implemented: ${task.taskId}`);
    default: {
      const neverTaskId: never = task.taskId;
      throw new Error(`Unknown task id: ${neverTaskId}`);
    }
  }
}

async function executePlan({
  planId,
  command,
  plan,
  services,
  skipSuccessfulTasks,
  resetBeforeRun,
}: ExecutePlanOptions): Promise<RunnerResult> {
  const total = plan.tasks.length;

  if (resetBeforeRun) {
    log("debug", `Resetting ${total} tasks`);
    for (const task of plan.tasks) {
      resetTask(task);
    }
    await services.json.writePlan(planId, plan);
  }

  for (let i = 0; i < total; i++) {
    const task = plan.tasks[i];
    const progress = `[${i + 1}/${total}]`;

    if (skipSuccessfulTasks && task.state === "success") {
      log("debug", `${progress} Skipping "${task.title}" (already succeeded)`);
      continue;
    }

    log("info", `${progress} Running "${task.title}" (${task.taskId})`);

    task.state = "running";
    task.startedAt = nowIso();
    delete task.finishedAt;
    delete task.errorMessage;
    await services.json.writePlan(planId, plan);

    try {
      await dispatchTask(task, services);
      task.state = "success";
      task.finishedAt = nowIso();
      await services.json.writePlan(planId, plan);
      log("info", `${progress} Completed "${task.title}"`);
    } catch (error: unknown) {
      task.state = "error";
      task.errorMessage = error instanceof Error ? error.message : String(error);
      task.finishedAt = nowIso();
      await services.json.writePlan(planId, plan);
      log("error", `${progress} Failed "${task.title}": ${task.errorMessage}`);
      throw error;
    }
  }

  const completedTaskCount = plan.tasks.filter((task) => task.state === "success").length;
  log("info", `Plan complete: ${completedTaskCount}/${total} tasks succeeded`);
  return {
    command,
    planId,
    taskCount: total,
    completedTaskCount,
  };
}

function createServiceRegistry(paths: RunnerPaths): ServiceRegistry {
  const serviceLog = new Log("service", "green");
  const serviceOptions = {
    repoRootFolder: paths.repoRootFolder,
    robotPackageFolder: paths.robotPackageFolder,
    log: serviceLog,
  };

  const json = new JsonService(serviceOptions);
  const markdown = new MarkdownService(serviceOptions);
  const image = new ImageService(serviceOptions);
  const openai = new OpenAIService(serviceOptions);
  const workflow = new WorkflowService({
    ...serviceOptions,
    recipesRoot: paths.recipesRoot,
    buildCommand,
    runPlanFromStart,
    resumePlan,
  });

  return {
    json,
    markdown,
    image,
    openai,
    workflow,
  };
}

export async function runPlanFromStart(
  input: RunFromStartInput,
): Promise<RunnerResult> {
  ensureValidPlanId(input.planId);
  log("info", `Starting plan "${input.planId}" from scratch`);
  const paths = resolveRunnerPaths(input);
  const services = createServiceRegistry(paths);
  const plan = await loadPlanOrThrow(services.json, input.planId);

  return executePlan({
    planId: input.planId,
    command: "run",
    plan,
    services,
    skipSuccessfulTasks: false,
    resetBeforeRun: true,
  });
}

export async function resumePlan(input: ResumeInput): Promise<RunnerResult> {
  ensureValidPlanId(input.planId);
  log("info", `Resuming plan "${input.planId}"`);
  const paths = resolveRunnerPaths(input);
  const services = createServiceRegistry(paths);
  const plan = await loadPlanOrThrow(services.json, input.planId);
  const hasRuntimeState = hasPersistedRuntimeState(plan);

  return executePlan({
    planId: input.planId,
    command: "resume",
    plan,
    services,
    skipSuccessfulTasks: hasRuntimeState,
    resetBeforeRun: !hasRuntimeState,
  });
}
