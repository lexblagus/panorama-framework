import type { LogFn } from "../../log.js";

export interface ServiceBaseOptions {
  repoRootFolder: string;
  robotPackageFolder: string;
  log?: LogFn;
}
