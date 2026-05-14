import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import Log, { type LogFn } from "./utils/log.js";
import { buildCommand } from "./builder.js";
import type { BuildCommandResult } from "./types/builder.js";
import { resumePlan, runPlanFromStart } from "./runner.js";
import type { RunnerResult } from "./types/runner.js";

const ID_SEGMENT_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;
const ENV_KEY_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Parses a single `.env` file line into a `[key, value]` pair.
 * Supports `export KEY=VALUE` syntax, quoted values, and strips comment / blank lines.
 * Returns `null` for lines that should be ignored.
 */
function parseEnvLine(line: string): [string, string] | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const withoutExport = trimmed.startsWith("export ")
    ? trimmed.slice("export ".length)
    : trimmed;
  const separatorIndex = withoutExport.indexOf("=");
  if (separatorIndex <= 0) {
    return null;
  }

  const key = withoutExport.slice(0, separatorIndex).trim();
  if (!key) {
    return null;
  }

  if (!ENV_KEY_PATTERN.test(key)) {
    return null;
  }

  let value = withoutExport.slice(separatorIndex + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

/** Reads `robot/.env` and injects any declared variables into `process.env`, skipping keys that are already set. */
async function loadDotEnvIfPresent(): Promise<void> {
  const robotPackageFolder = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
  );
  const dotEnvPath = path.join(robotPackageFolder, ".env");

  try {
    const source = await readFile(dotEnvPath, "utf8");
    for (const line of source.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (!parsed) {
        continue;
      }
      const [key, value] = parsed;
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT"
    ) {
      return;
    }
    throw error;
  }
}

export type CliCommand =
  | { command: "build"; recipeId: string }
  | { command: "exec"; recipeId: string }
  | { command: "run"; planId: string }
  | { command: "resume"; planId: string };

/** Signals a user-facing CLI input error; caught by `runCli` to print a friendly message and exit 1 without a stack trace. */
export class CliError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CliError";
  }
}

function usage(): string {
  return [
    "Usage:",
    "  robot build --recipe <recipe-id>",
    "  robot exec --recipe <recipe-id>",
    "  robot run --plan <plan-id>",
    "  robot resume --plan <plan-id>",
    "",
    "Rules:",
    "  build/exec accept only --recipe",
    "  run/resume accept only --plan",
  ].join("\n");
}

function isRecipeNotFoundError(error: unknown): error is Error {
  return error instanceof Error && error.message.startsWith("Recipe not found");
}

function ensureId(flag: "--recipe" | "--plan", value: string): string {
  if (value.startsWith("/") || value.endsWith("/")) {
    throw new CliError(
      `Invalid ${flag} value "${value}". IDs must be relative path-like stems.`,
    );
  }
  const segments = value.split("/");
  if (segments.length === 0) {
    throw new CliError(
      `Invalid ${flag} value "${value}". IDs must be relative path-like stems.`,
    );
  }
  for (const segment of segments) {
    if (
      segment.length === 0 ||
      segment === "." ||
      segment === ".." ||
      !ID_SEGMENT_PATTERN.test(segment)
    ) {
      throw new CliError(
        `Invalid ${flag} value "${value}". Must be slash-separated segments matching ${ID_SEGMENT_PATTERN.source}.`,
      );
    }
  }
  if (value.includes("//")) {
    throw new CliError(
      `Invalid ${flag} value "${value}". IDs must not contain empty path segments.`,
    );
  }
  return value;
}

function readFlagMap(args: string[]): Map<string, string> {
  const values = new Map<string, string>();

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (!arg.startsWith("--")) {
      throw new CliError(`Unexpected positional argument: ${arg}`);
    }

    const value = args[index + 1];
    if (!value || value.startsWith("--")) {
      throw new CliError(`Missing value for ${arg}.`);
    }
    if (values.has(arg)) {
      throw new CliError(`Duplicate flag: ${arg}`);
    }
    values.set(arg, value);
    index += 1;
  }

  return values;
}

function expectOnlyFlag(
  args: string[],
  required: "--recipe" | "--plan",
  rejected: "--recipe" | "--plan",
): string {
  const flagValues = readFlagMap(args);

  if (flagValues.has(rejected)) {
    throw new CliError(`${required === "--recipe" ? "build/exec" : "run/resume"} do not accept ${rejected}.`);
  }

  const requiredValue = flagValues.get(required);
  if (!requiredValue) {
    throw new CliError(`Missing required flag: ${required}`);
  }

  for (const key of flagValues.keys()) {
    if (key !== required) {
      throw new CliError(`Unknown argument: ${key}`);
    }
  }

  return ensureId(required, requiredValue);
}

/** Parses raw CLI arguments (after the script name) into a typed `CliCommand` discriminated union. */
export function parseCliArgs(argv: string[]): CliCommand {
  const [command, ...rest] = argv;
  if (!command) {
    throw new CliError("Missing subcommand.");
  }

  switch (command) {
    case "build":
      return {
        command,
        recipeId: expectOnlyFlag(rest, "--recipe", "--plan"),
      };
    case "exec":
      return {
        command,
        recipeId: expectOnlyFlag(rest, "--recipe", "--plan"),
      };
    case "run":
      return {
        command,
        planId: expectOnlyFlag(rest, "--plan", "--recipe"),
      };
    case "resume":
      return {
        command,
        planId: expectOnlyFlag(rest, "--plan", "--recipe"),
      };
    default:
      throw new CliError(`Unknown subcommand: ${command}`);
  }
}

function logBuildResult(log: LogFn, result: BuildCommandResult): void {
  log("info", `Build complete: plan "${result.planId}" with ${result.taskCount} tasks`);
}

function logRunnerResult(log: LogFn, result: RunnerResult): void {
  const status = result.completedTaskCount === result.taskCount ? "Done" : "Partial";
  log("info", `${status}: ${result.completedTaskCount}/${result.taskCount} tasks completed (${result.command} "${result.planId}")`);
}

/**
 * Main CLI entry point: loads `.env`, parses arguments, and dispatches to `buildCommand`,
 * `runPlanFromStart`, or `resumePlan`.  Handles `CliError` and recipe-not-found gracefully.
 */
export async function runCli(argv: string[]): Promise<void> {
  await loadDotEnvIfPresent();

  if (argv.length === 1 && (argv[0] === "--help" || argv[0] === "-h")) {
    console.log(usage());
    process.exit(0);
  }

  const log = new Log("cli", "yellow");

  try {
    const parsed = parseCliArgs(argv);

    switch (parsed.command) {
      case "build": {
        const result = await buildCommand({ recipeId: parsed.recipeId });
        logBuildResult(log, result);
        return;
      }
      case "exec": {
        const built = await buildCommand({ recipeId: parsed.recipeId });
        const result = await runPlanFromStart({ planId: built.planId });
        logRunnerResult(log, result);
        return;
      }
      case "run": {
        const result = await runPlanFromStart({ planId: parsed.planId });
        logRunnerResult(log, result);
        return;
      }
      case "resume": {
        const result = await resumePlan({ planId: parsed.planId });
        logRunnerResult(log, result);
        return;
      }
      default:
        throw new CliError(`Unknown subcommand: ${(parsed as { command: string }).command}`);
    }
  } catch (error) {
    if (error instanceof CliError) {
      console.error(error.message);
      console.error("");
      console.error(usage());
      process.exit(1);
    }
    if (isRecipeNotFoundError(error)) {
      console.error("Recipe not found");
      process.exit(1);
    }
    throw error;
  }
}

const invokedAsScript =
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedAsScript) {
  void runCli(process.argv.slice(2));
}
