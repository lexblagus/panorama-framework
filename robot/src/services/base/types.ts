import type { LogFn } from "../../utils/log.js";

export interface ServiceBaseOptions {
  repoRootFolder: string;
  robotPackageFolder: string;
  log?: LogFn;
}
