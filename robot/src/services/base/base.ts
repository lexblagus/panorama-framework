import path from "node:path";
import type { ServiceBaseOptions } from "./types.js";

export abstract class BaseService {
  #repoRootFolder: string;
  #robotPackageFolder: string;

  constructor(options: ServiceBaseOptions) {
    this.#repoRootFolder = path.resolve(options.repoRootFolder);
    this.#robotPackageFolder = path.resolve(options.robotPackageFolder);
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
