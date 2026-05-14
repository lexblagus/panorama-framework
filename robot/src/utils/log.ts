import chalk, { type ChalkInstance } from "chalk";

export type Level =
  | "trace"
  | "debug"
  | "log"
  | "info"
  | "warn"
  | "error"
  | "fatal";

export type LabelColor =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "blackBright"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";

export type LogFn = (level: Level, ...message: unknown[]) => void;

const mapLevels: Level[] = ["trace", "debug", "log", "info", "warn", "error", "fatal"];

const BG_LABEL_FN: Record<LabelColor, ChalkInstance> = {
  black: chalk.bgBlack,
  red: chalk.bgRed,
  green: chalk.bgGreen,
  yellow: chalk.bgYellow,
  blue: chalk.bgBlue,
  magenta: chalk.bgMagenta,
  cyan: chalk.bgCyan,
  white: chalk.bgWhite,
  gray: chalk.bgGray,
  grey: chalk.bgGrey,
  blackBright: chalk.bgBlackBright,
  redBright: chalk.bgRedBright,
  greenBright: chalk.bgGreenBright,
  yellowBright: chalk.bgYellowBright,
  blueBright: chalk.bgBlueBright,
  magentaBright: chalk.bgMagentaBright,
  cyanBright: chalk.bgCyanBright,
  whiteBright: chalk.bgWhiteBright,
};

function resolveLogLevel(): Level {
  const env = process.env.LOG_LEVEL;
  if (env && (mapLevels as string[]).includes(env)) {
    return env as Level;
  }
  return "info";
}

const logLevel: Level = resolveLogLevel();

class Log {
  constructor(label: string, labelColor: LabelColor = "white") {
    const bgFn = BG_LABEL_FN[labelColor];
    const labelTag = bgFn.black(` ${label} `);

    const logFn: LogFn = (level: Level, ...message: unknown[]) => {
      if (mapLevels.indexOf(logLevel) > mapLevels.indexOf(level)) return;

      switch (level) {
        case "trace":
          console.log(chalk.bgGrey.black(" TRACE "), labelTag, ...message);
          break;
        case "debug":
          console.debug(chalk.bgWhiteBright.black(" DEBUG "), labelTag, ...message);
          break;
        case "log":
          console.log(chalk.bgGreen.black("  LOG  "), labelTag, ...message);
          break;
        case "info":
          console.info(chalk.bgBlueBright.black(" INFO  "), labelTag, ...message);
          break;
        case "warn":
          console.warn(chalk.bgYellow.black(" WARN  "), labelTag, ...message);
          break;
        case "error":
          console.error(chalk.bgRed.black(" ERROR "), labelTag, ...message);
          break;
        case "fatal":
          console.error(chalk.bgMagenta.black(" FATAL "), labelTag, ...message);
          break;
      }
    };

    return logFn as unknown as Log;
  }
}

export default Log as unknown as {
  new(label: string, labelColor?: LabelColor): LogFn;
};
