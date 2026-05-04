import path from "node:path";
import type { ServiceBaseOptions } from "./types.js";

export abstract class BaseService {
  protected readonly repoRoot: string;
  protected readonly robotRoot: string;

  constructor(options: ServiceBaseOptions) {
    this.repoRoot = path.resolve(options.repoRoot);
    this.robotRoot = path.resolve(options.robotRoot);
  }

  protected resolveRepoPath(targetPath: string): string {
    if (path.isAbsolute(targetPath)) {
      return targetPath;
    }
    return path.join(this.repoRoot, targetPath);
  }

  protected resolveRobotPath(...segments: string[]): string {
    return path.join(this.robotRoot, ...segments);
  }
}
