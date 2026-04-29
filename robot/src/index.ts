type ReservedCommand = "edit" | "upload";
type SupportedCommand = "generate" | ReservedCommand;

interface GenerateOptions {
  command: "generate";
  promptFile: string;
  output: string;
  cwd: string;
}

function usage(): string {
  return [
    "Usage:",
    "  robot generate --prompt-file <path> --output <path>",
    "",
    "Reserved subcommands:",
    "  edit",
    "  upload",
  ].join("\n");
}

function fail(message: string): never {
  console.error(message);
  console.error("");
  console.error(usage());
  process.exit(1);
}

function takeValue(args: string[], index: number, flag: string): string {
  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    fail(`Missing value for ${flag}.`);
  }
  return value;
}

function parseGenerate(args: string[]): GenerateOptions {
  let promptFile = "";
  let output = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    switch (arg) {
      case "--prompt-file":
        promptFile = takeValue(args, index, arg);
        index += 1;
        break;
      case "--output":
        output = takeValue(args, index, arg);
        index += 1;
        break;
      default:
        fail(`Unknown argument: ${arg}`);
    }
  }

  if (!promptFile) {
    fail("Missing required flag: --prompt-file");
  }

  if (!output) {
    fail("Missing required flag: --output");
  }

  return {
    command: "generate",
    promptFile,
    output,
    cwd: process.cwd(),
  };
}

function main(argv: string[]): void {
  const [command, ...rest] = argv;

  if (!command || command === "--help" || command === "-h") {
    console.log(usage());
    process.exit(command ? 0 : 1);
  }

  switch (command as SupportedCommand) {
    case "generate":
      console.log(
        JSON.stringify(
          {
            scaffold: true,
            ...parseGenerate(rest),
          },
          null,
          2,
        ),
      );
      break;
    case "edit":
    case "upload":
      fail(`The "${command}" subcommand is reserved but not implemented yet.`);
      break;
    default:
      fail(`Unknown subcommand: ${command}`);
  }
}

main(process.argv.slice(2));
