import type { ServiceBaseOptions } from "../base/index.js";

export type JsonWriteFormat = "formatted" | "compact";

export interface JsonWriteOptions {
  format?: JsonWriteFormat;
}

export type JsonServiceOptions = ServiceBaseOptions;

export type RobotGlobalConfig = Record<string, unknown>;
export type RecipeState = Record<string, unknown>;
