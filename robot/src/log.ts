import chalk from "chalk";

export type Level =
  | "trace"
  | "debug"
  | "log"
  | "info"
  | "warn"
  | "error"
  | "fatal";

const mapLevels = ["trace", "debug", "log", "info", "warn", "error", "fatal"];

const logLevel: Level = "info";

export default (level: Level, ...message: any[]) => {
  if (mapLevels.indexOf(logLevel) > mapLevels.indexOf(level)) return;

  switch (level) {
    case "trace":
      console.log(chalk.bgGrey.black(" TRACE "), ...message);
      break;
    case "debug":
      console.debug(chalk.bgWhiteBright.black(" DEBUG "), ...message);
      break;
    case "log":
      console.log(chalk.bgGreen.black("  LOG  "), ...message);
      break;
    case "info":
      console.info(chalk.bgBlueBright.black(" INFO  "), ...message);
      break;
    case "warn":
      console.warn(chalk.bgYellow.black(" WARN  "), ...message);
      break;
    case "error":
      console.error(chalk.bgRed.black(" ERROR "), ...message);
      break;
    case "fatal":
      console.error(chalk.bgMagenta.black(" FATAL "), ...message);
      break;
  }
};

/* 
log('trace', 'trace');
log('debug', 'debug');
log('log', 'log');
log('info', 'info');
log('warn', 'warn');
log('error', 'error');
log('fatal', 'fatal');
 */