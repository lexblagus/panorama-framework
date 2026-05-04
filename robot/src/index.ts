import { pathToFileURL } from "node:url";
import { buildCommand } from "./builder.js";
import { resumePlan, runPlanFromStart } from "./runner.js";

const ID_SEGMENT_PATTERN = /^[a-z0-9_-][a-z0-9_.-]*$/;

export type CliCommand =
  | { command: "build"; recipeId: string }
  | { command: "exec"; recipeId: string }
  | { command: "run"; planId: string }
  | { command: "resume"; planId: string };

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

export async function runCli(argv: string[]): Promise<void> {
  if (argv.length === 1 && (argv[0] === "--help" || argv[0] === "-h")) {
    console.log(usage());
    process.exit(0);
  }

  try {
    const parsed = parseCliArgs(argv);

    switch (parsed.command) {
      case "build": {
        const result = await buildCommand({ recipeId: parsed.recipeId });
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case "exec": {
        const built = await buildCommand({ recipeId: parsed.recipeId });
        const result = await runPlanFromStart({ planId: built.planId });
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case "run": {
        const result = await runPlanFromStart({ planId: parsed.planId });
        console.log(JSON.stringify(result, null, 2));
        return;
      }
      case "resume": {
        const result = await resumePlan({ planId: parsed.planId });
        console.log(JSON.stringify(result, null, 2));
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
    throw error;
  }
}

const invokedAsScript =
  process.argv[1] != null &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedAsScript) {
  void runCli(process.argv.slice(2));
}
