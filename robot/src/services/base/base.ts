import path from "node:path";
import type { LogFn } from "../../log.js";
import type { ServiceBaseOptions } from "./types.js";

const noopLog: LogFn = () => {};

export abstract class BaseService {
  #repoRootFolder: string;
  #robotPackageFolder: string;
  protected readonly log: LogFn;

  constructor(options: ServiceBaseOptions) {
    this.#repoRootFolder = path.resolve(options.repoRootFolder);
    this.#robotPackageFolder = path.resolve(options.robotPackageFolder);
    this.log = options.log ?? noopLog;
  }

  protected resolveRepoPath(targetPath: string): string {
    if (path.isAbsolute(targetPath)) {
      return targetPath;
    }
    return path.join(this.#repoRootFolder, targetPath);
  }

  protected resolveRobotPath(...segments: string[]): string {
    return path.join(this.#robotPackageFolder, ...segments);
  }
}
