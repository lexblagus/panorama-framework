import path from "node:path";
import type { LogFn } from "../../utils/log.js";
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
    const resolved = path.isAbsolute(targetPath)
      ? path.normalize(targetPath)
      : path.join(this.#repoRootFolder, targetPath);

    const root = this.#repoRootFolder;
    if (resolved !== root && !resolved.startsWith(root + path.sep)) {
      throw new Error(`Path is outside the repo root: "${targetPath}"`);
    }
    return resolved;
  }

  protected resolveRobotPath(...segments: string[]): string {
    return path.join(this.#robotPackageFolder, ...segments);
  }
}
