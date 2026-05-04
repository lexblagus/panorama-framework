export type JsonWriteFormat = "formatted" | "compact";

export interface JsonWriteOptions {
  format?: JsonWriteFormat;
}

export interface JsonServiceOptions {
  repoRoot: string;
  robotRoot: string;
}

export type RobotGlobalConfig = Record<string, unknown>;
export type RecipeState = Record<string, unknown>;
