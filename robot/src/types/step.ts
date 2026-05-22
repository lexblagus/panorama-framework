import type { AssembleLayersArgs, CreateBridgeArgs, ComposeTilesPreviewArgs } from "../services/image/types.js";
import type { MarkdownInsertRequest } from "../services/markdown/types.js";
import type { RunRecipeArgs } from "../services/workflow/types.js";

/** Arguments for the `openai.generate-image` task. Uses plain strings for model/quality/format/size so recipe configs don't need to import OpenAI enum types. */
export interface OpenAIGenerateImageStepArgs {
  prompt: string;
  outputDir: string;
  outputFilePrefix: string;
  inputImages?: string[];
  model?: string;
  maskFile?: string;
  size?: string;
  n?: number;
  outputSuffixes?: string[];
  quality?: string;
  outputFormat?: string;
  outputCompression?: number;
  background?: string;
  saveSidecarMetadataFile?: boolean;
  user?: string;
}

/** Arguments for the `json.read` task. */
export interface JsonReadStepArgs {
  path: string;
}

/** Arguments for the `json.write` task. */
export interface JsonWriteStepArgs {
  file: string;
  value: unknown;
}

/** Arguments for the `markdown.read` task. Exactly one of `file` or `targetPath` must be provided. */
export type MarkdownReadStepArgs =
  | { file: string; targetPath?: never }
  | { targetPath: string; file?: never };

/** Arguments for the `markdown.write` task. */
export interface MarkdownWriteStepArgs {
  file: string;
  content: string;
}

/** Common metadata carried by every step variant. */
type StepBase = {
  title: string;
  description?: string;
};

/**
 * A recipe step — a discriminated union on `taskId` that pairs each task identifier
 * with its expected `arguments` shape. TypeScript will enforce the correct argument
 * fields and types when authoring recipes.
 */
export type Step =
  | (StepBase & { taskId: "openai.generate-image"; arguments: OpenAIGenerateImageStepArgs })
  | (StepBase & { taskId: "image.create-bridge";    arguments: CreateBridgeArgs })
  | (StepBase & { taskId: "image.compose-tiles";    arguments: ComposeTilesPreviewArgs })
  | (StepBase & { taskId: "image.assemble-layers";  arguments: AssembleLayersArgs })
  | (StepBase & { taskId: "markdown.read";         arguments: MarkdownReadStepArgs })
  | (StepBase & { taskId: "markdown.write";        arguments: MarkdownWriteStepArgs })
  | (StepBase & { taskId: "markdown.insert";       arguments: MarkdownInsertRequest })
  | (StepBase & { taskId: "json.read";             arguments: JsonReadStepArgs })
  | (StepBase & { taskId: "json.write";            arguments: JsonWriteStepArgs })
  | (StepBase & { taskId: "workflow.run-recipe";   arguments: RunRecipeArgs });
