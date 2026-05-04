export type OpenAIModel =
  | "gpt-image-2"
  | "gpt-image-1.5"
  | "gpt-image-1"
  | "gpt-image-1-mini";
export type OpenAIImageSize = "auto" | `${number}x${number}`;
export type OpenAIImageQuality = "high" | "medium" | "low" | "auto";
export type OpenAIOutputFormat = "png" | "jpeg" | "webp";
export type OpenAIImageBackground = "transparent" | "opaque" | "auto";

export interface OpenAIServiceConfig {
  baseUrl: string;
  imageGenerationServicePath: string;
  imageEditServicePath: string;
  responsesServicePath: string;
  generationTimeoutMs: number;
  defaults: {
    model: OpenAIModel;
    size: OpenAIImageSize;
    quality: OpenAIImageQuality;
    outputImages: number;
    outputFormat: OpenAIOutputFormat;
    defaultSaveSidecarMetadataFile: boolean;
  };
}

export interface OpenAIServiceOptions extends ServiceBaseOptions {
  apiKey?: string;
  fetchImpl?: typeof fetch;
  config?: Partial<OpenAIServiceConfig>;
}

export interface GenerateImageArgs {
  prompt: string;
  outputDir: string;
  outputFilePrefix: string;
  inputImages?: string[];
  model?: OpenAIModel;
  maskFile?: string;
  size?: OpenAIImageSize;
  n?: number;
  quality?: OpenAIImageQuality;
  outputFormat?: OpenAIOutputFormat;
  outputCompression?: number;
  background?: OpenAIImageBackground;
  saveSidecarMetadataFile?: boolean;
  user?: string;
}

export interface GeneratedImageFile {
  file: string;
  revisedPrompt?: string;
}

export interface GenerateImageResult {
  files: GeneratedImageFile[];
}
import type { ServiceBaseOptions } from "../base/index.js";
