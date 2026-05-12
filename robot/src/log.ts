import chalk from "chalk";

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

export type LogFn = (level: Level, ...message: any[]) => void;

const mapLevels = ["trace", "debug", "log", "info", "warn", "error", "fatal"];
const logLevel: Level = "debug";

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

class Log {
  constructor(label: string, labelColor: LabelColor = "white") {
    const labelTag = (chalk as any)[`bg${capitalize(labelColor)}`].black(
      ` ${label} `
    );

    const logFn: LogFn = (level: Level, ...message: any[]) => {
      if (mapLevels.indexOf(logLevel) > mapLevels.indexOf(level)) return;

      switch (level) {
        case "trace":
          console.log(
            chalk.bgGrey.black(" TRACE "),
            labelTag,
            ...message
          );
          break;
        case "debug":
          console.debug(
            chalk.bgWhiteBright.black(" DEBUG "),
            labelTag,
            ...message
          );
          break;
        case "log":
          console.log(
            chalk.bgGreen.black("  LOG  "),
            labelTag,
            ...message
          );
          break;
        case "info":
          console.info(
            chalk.bgBlueBright.black(" INFO  "),
            labelTag,
            ...message
          );
          break;
        case "warn":
          console.warn(
            chalk.bgYellow.black(" WARN  "),
            labelTag,
            ...message
          );
          break;
        case "error":
          console.error(
            chalk.bgRed.black(" ERROR "),
            labelTag,
            ...message
          );
          break;
        case "fatal":
          console.error(
            chalk.bgMagenta.black(" FATAL "),
            labelTag,
            ...message
          );
          break;
      }
    };

    return logFn as unknown as Log;
  }
}

export default Log as unknown as {
  new(label: string, labelColor?: LabelColor): LogFn;
};
