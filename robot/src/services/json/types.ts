import type { ServiceBaseOptions } from "../base/index.js";

/** Controls JSON serialisation: `"formatted"` uses tab indentation, `"compact"` has no whitespace. */
export type JsonWriteFormat = "formatted" | "compact";

/** Options accepted by JSON write methods. */
export interface JsonWriteOptions {
  format?: JsonWriteFormat;
}

export type JsonServiceOptions = ServiceBaseOptions;

/** Arbitrary configuration loaded from `robot/config.json`. */
export type RobotGlobalConfig = Record<string, unknown>;

/** Arbitrary key-value state persisted per recipe in `robot/transient/<recipeId>.state.json`. */
export type RecipeState = Record<string, unknown>;
