export type OpenAIModel =
  | "gpt-image-2"
  | "gpt-image-1.5"
  | "gpt-image-1"
  | "gpt-image-1-mini";
export type OpenAIImageSize = "auto" | `${number}x${number}`;
export type OpenAIImageQuality = "high" | "medium" | "low" | "auto";
export type OpenAIOutputFormat = "png" | "jpeg" | "webp";
export type OpenAIImageBackground = "transparent" | "opaque" | "auto";

/**
 * Static configuration for the OpenAI service: API endpoints, timeouts, retry count, and
 * default generation parameters loaded from `services/openai/config.json`.
 */
export interface OpenAIServiceConfig {
  baseUrl: string;
  imageGenerationServicePath: string;
  imageEditServicePath: string;
  responsesServicePath: string;
  generationTimeoutMs: number;
  retriesOnError: number;
  defaults: {
    model: OpenAIModel;
    size: OpenAIImageSize;
    quality: OpenAIImageQuality;
    outputImages: number;
    outputFormat: OpenAIOutputFormat;
    defaultSaveSidecarMetadataFile: boolean;
    samplePaddingZeroes: number;
  };
}

/** Constructor options for `OpenAIService`; `fetchImpl` and `config` are mainly for testing. */
export interface OpenAIServiceOptions extends ServiceBaseOptions {
  apiKey?: string;
  fetchImpl?: typeof fetch;
  config?: Partial<OpenAIServiceConfig>;
}

/** Arguments for a single image-generation or image-edit request. Presence of `inputImages` selects edit mode. */
export interface GenerateImageArgs {
  prompt: string;
  outputDir: string;
  outputFilePrefix: string;
  inputImages?: string[];
  model?: OpenAIModel;
  maskFile?: string;
  size?: OpenAIImageSize;
  n?: number;
  outputSuffixes?: string[];
  quality?: OpenAIImageQuality;
  outputFormat?: OpenAIOutputFormat;
  outputCompression?: number;
  background?: OpenAIImageBackground;
  saveSidecarMetadataFile?: boolean;
  user?: string;
}

/** A single output image file path, plus the model's revised prompt if the API returned one. */
export interface GeneratedImageFile {
  file: string;
  revisedPrompt?: string;
}

/** Result of a successful `generateImage` call; `files` has one entry per requested output. */
export interface GenerateImageResult {
  files: GeneratedImageFile[];
}
import type { ServiceBaseOptions } from "../base/index.js";
