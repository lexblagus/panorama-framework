import path from "node:path";
import type { LogFn } from "../../utils/log.js";
import type { ServiceBaseOptions } from "./types.js";

const noopLog: LogFn = () => {};

/** Base class for all robot services; supplies path-safe resolution helpers and a shared logger. */
export abstract class BaseService {
  #repoRootFolder: string;
  #robotPackageFolder: string;
  protected readonly log: LogFn;

  constructor(options: ServiceBaseOptions) {
    this.#repoRootFolder = path.resolve(options.repoRootFolder);
    this.#robotPackageFolder = path.resolve(options.robotPackageFolder);
    this.log = options.log ?? noopLog;
  }

  /**
   * Resolves `targetPath` against the repo root and throws if the result would escape that root,
   * preventing path-traversal attacks from recipe-supplied strings.
   */
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

  /** Joins `segments` under the robot package folder (no traversal check needed — internal use only). */
  protected resolveRobotPath(...segments: string[]): string {
    return path.join(this.#robotPackageFolder, ...segments);
  }
}
