import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import defaultConfigJson from "./config.json" with { type: "json" };
import { BaseService } from "../base/index.js";
import type {
  GenerateImageArgs,
  GenerateImageResult,
  GeneratedImageFile,
  OpenAIImageBackground,
  OpenAIImageQuality,
  OpenAIImageSize,
  OpenAIModel,
  OpenAIOutputFormat,
  OpenAIServiceConfig,
  OpenAIServiceOptions,
} from "./types.js";

interface OpenAIImageResponseDataItem {
  b64_json?: string;
  revised_prompt?: string;
}

interface OpenAIImageResponse {
  data?: OpenAIImageResponseDataItem[];
}

const GPT_IMAGE_LEGACY_MODELS: ReadonlySet<OpenAIModel> = new Set([
  "gpt-image-1.5",
  "gpt-image-1",
  "gpt-image-1-mini",
]);

const LEGACY_ALLOWED_SIZES: ReadonlySet<OpenAIImageSize> = new Set([
  "1024x1024",
  "1024x1536",
  "1536x1024",
]);

const POPULAR_GPT_IMAGE_2_SIZES: ReadonlySet<OpenAIImageSize> = new Set([
  "1024x1024",
  "1024x1536",
  "1536x1024",
  "2048x2048",
  "2048x1152",
  "3840x2160",
  "2160x3840",
]);

const DEFAULT_CONFIG: OpenAIServiceConfig = {
  ...(defaultConfigJson as OpenAIServiceConfig),
};

function normalizeResponse(response: unknown): OpenAIImageResponseDataItem[] {
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response) ||
    !Array.isArray((response as OpenAIImageResponse).data)
  ) {
    return [];
  }

  return (response as OpenAIImageResponse).data ?? [];
}

function extensionForOutputFormat(format: OpenAIOutputFormat): string {
  if (format === "jpeg") {
    return "jpg";
  }
  return format;
}

/** OpenAI Images Edits rejects parts with default `application/octet-stream`. */
const IMAGE_MIME_BY_EXT: Readonly<Record<string, string>> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

function mimeTypeForImageFilePath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mime = IMAGE_MIME_BY_EXT[ext];
  if (!mime) {
    throw new Error(
      `Unsupported image extension "${ext || "(none)"}" for "${filePath}". Use .png, .jpg, .jpeg, or .webp.`,
    );
  }
  return mime;
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parseSize(size: Exclude<OpenAIImageSize, "auto">): {
  width: number;
  height: number;
} | null {
  const match = /^(\d+)x(\d+)$/.exec(size);
  if (!match) {
    return null;
  }
  return {
    width: Number.parseInt(match[1], 10),
    height: Number.parseInt(match[2], 10),
  };
}

function isSizeAllowedForGptImage2(size: OpenAIImageSize): boolean {
  if (size === "auto" || POPULAR_GPT_IMAGE_2_SIZES.has(size)) {
    return true;
  }

  const parsed = parseSize(size as Exclude<OpenAIImageSize, "auto">);
  if (!parsed) {
    return false;
  }

  const longEdge = Math.max(parsed.width, parsed.height);
  const shortEdge = Math.min(parsed.width, parsed.height);
  const totalPixels = parsed.width * parsed.height;
  const ratio = longEdge / shortEdge;

  return (
    longEdge <= 3840 &&
    parsed.width % 16 === 0 &&
    parsed.height % 16 === 0 &&
    ratio <= 3 &&
    totalPixels >= 655_360 &&
    totalPixels <= 8_294_400
  );
}

/** Service that wraps the OpenAI Images API, supporting both generation and edit (inpainting) modes with automatic retries. */
export class OpenAIService extends BaseService {
  private readonly fetchImpl: typeof fetch;
  private readonly apiKey?: string;
  private readonly config: OpenAIServiceConfig;

  constructor(options: OpenAIServiceOptions) {
    super(options);
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    this.config = {
      ...DEFAULT_CONFIG,
      ...options.config,
      defaults: {
        ...DEFAULT_CONFIG.defaults,
        ...(options.config?.defaults ?? {}),
      },
    };
  }

  /**
   * Validates `args` before a network call: checks required fields, numeric constraints,
   * size compatibility per model, and mask/inputImages co-requirements.
   */
  private assertGenerateImageArgs(args: GenerateImageArgs): void {
    if (!args.prompt || !args.prompt.trim()) {
      throw new Error("prompt is required");
    }
    if (!args.outputDir || !args.outputDir.trim()) {
      throw new Error("outputDir is required");
    }
    if (!args.outputFilePrefix || !args.outputFilePrefix.trim()) {
      throw new Error("outputFilePrefix is required");
    }

    if (args.n !== undefined) {
      if (!Number.isInteger(args.n) || args.n <= 0) {
        throw new Error("n must be a positive integer");
      }
    }

    const model: OpenAIModel = args.model ?? this.config.defaults.model;
    const size: OpenAIImageSize = args.size ?? this.config.defaults.size;

    if (args.outputCompression !== undefined) {
      if (
        !Number.isInteger(args.outputCompression) ||
        args.outputCompression < 0 ||
        args.outputCompression > 100
      ) {
        throw new Error("outputCompression must be an integer between 0 and 100");
      }
    }

    if (args.maskFile !== undefined) {
      if (!args.inputImages || args.inputImages.length !== 1) {
        throw new Error("maskFile requires exactly one input image");
      }
    }

    if (model === "gpt-image-2") {
      if (!isSizeAllowedForGptImage2(size)) {
        throw new Error(`Unsupported size "${size}" for model "${model}"`);
      }
    } else if (!LEGACY_ALLOWED_SIZES.has(size)) {
      throw new Error(
        `Unsupported size "${size}" for model "${model}". Allowed sizes: 1024x1024, 1024x1536, 1536x1024`,
      );
    }

    if (
      model === "gpt-image-2" &&
      args.background !== undefined &&
      args.background === "transparent"
    ) {
      throw new Error('background "transparent" is not supported for model "gpt-image-2"');
    }
  }

  /** Creates an `AbortSignal` that fires after `timeoutMs` milliseconds; the underlying timer is unreffed so it won't block process exit. */
  private createTimeoutSignal(timeoutMs: number): AbortSignal {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(new Error("OpenAI request timed out")),
      timeoutMs,
    );
    if (typeof timer === "object" && timer !== null && "unref" in timer) {
      (timer as NodeJS.Timeout).unref();
    }
    return controller.signal;
  }

  /**
   * Generates or edits images via the OpenAI API and writes the results to disk.
   * Presence of `inputImages` selects the edit endpoint; absence uses the generation endpoint.
   * Retries up to `config.retriesOnError` times on non-fatal HTTP or JSON parse errors.
   */
  async generateImage(args: GenerateImageArgs): Promise<GenerateImageResult> {
    this.assertGenerateImageArgs(args);

    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is required");
    }

    const model: OpenAIModel = args.model ?? this.config.defaults.model;
    const size: OpenAIImageSize = args.size ?? this.config.defaults.size;
    const quality: OpenAIImageQuality = args.quality ?? this.config.defaults.quality;
    const n = args.n ?? this.config.defaults.outputImages;
    const outputFormat: OpenAIOutputFormat =
      args.outputFormat ?? this.config.defaults.outputFormat;
    const saveSidecarMetadataFile =
      args.saveSidecarMetadataFile ??
      this.config.defaults.defaultSaveSidecarMetadataFile;

    const background: OpenAIImageBackground | undefined = args.background;
    const hasInputImages = Array.isArray(args.inputImages) && args.inputImages.length > 0;
    const hasMask = args.maskFile !== undefined;
    const isEditRequest = hasInputImages || hasMask;

    this.log(
      "info",
      `Generating image (model: ${model}, size: ${size}, quality: ${quality}${isEditRequest ? ", edit mode" : ""})...`,
    );

    const timeoutMs = this.config.generationTimeoutMs;
    const maxAttempts = Math.max(1, this.config.retriesOnError + 1);

    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      let response: Response;

      try {
        if (isEditRequest) {
          const form = new FormData();
          form.set("prompt", args.prompt);
          form.set("model", model);
          form.set("size", size);
          form.set("quality", quality);
          form.set("n", String(n));
          form.set("output_format", outputFormat);

          if (args.outputCompression !== undefined) {
            form.set("output_compression", String(args.outputCompression));
          }
          if (background !== undefined) {
            form.set("background", background);
          }
          if (args.user !== undefined) {
            form.set("user", args.user);
          }

          if (args.inputImages) {
            for (let index = 0; index < args.inputImages.length; index += 1) {
              const inputImagePath = this.resolveRepoPath(args.inputImages[index]);
              const buffer = await readFile(inputImagePath);
              const mime = mimeTypeForImageFilePath(inputImagePath);
              form.append(
                "image[]",
                new Blob([buffer], { type: mime }),
                path.basename(inputImagePath),
              );
            }
          }

          if (args.maskFile) {
            const maskPath = this.resolveRepoPath(args.maskFile);
            const buffer = await readFile(maskPath);
            const mime = mimeTypeForImageFilePath(maskPath);
            form.set("mask", new Blob([buffer], { type: mime }), path.basename(maskPath));
          }

          response = await this.fetchImpl(
            `${this.config.baseUrl}${this.config.imageEditServicePath}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
              },
              body: form,
              signal: this.createTimeoutSignal(timeoutMs),
            },
          );
        } else {
          const payload: Record<string, unknown> = {
            prompt: args.prompt,
            model,
            size,
            quality,
            n,
            output_format: outputFormat,
          };
          if (args.outputCompression !== undefined) {
            payload.output_compression = args.outputCompression;
          }
          if (background !== undefined) {
            payload.background = background;
          }
          if (args.user !== undefined) {
            payload.user = args.user;
          }

          response = await this.fetchImpl(
            `${this.config.baseUrl}${this.config.imageGenerationServicePath}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
              signal: this.createTimeoutSignal(timeoutMs),
            },
          );
        }

        if (!response.ok) {
          const body = await response.text();
          this.log("error", `OpenAI API returned ${response.status} (attempt ${attempt}/${maxAttempts})`);
          lastError = new Error(`OpenAI image generation failed (${response.status}): ${body}`);
          if (attempt < maxAttempts) continue;
          throw lastError;
        }

        this.log("debug", `OpenAI API responded ${response.status}`);

        let json: unknown;
        try {
          json = await response.json();
        } catch {
          this.log("error", `OpenAI response is not valid JSON (attempt ${attempt}/${maxAttempts})`);
          lastError = new Error(`OpenAI response is not valid JSON (status ${response.status})`);
          if (attempt < maxAttempts) continue;
          throw lastError;
        }

        const data = normalizeResponse(json);
        if (data.length === 0) {
          throw new Error("OpenAI image generation returned no image data");
        }

        const outputDir = this.resolveRepoPath(args.outputDir);
        await mkdir(outputDir, { recursive: true });

        const ext = extensionForOutputFormat(outputFormat);
        const multipleOutputs = data.length > 1;
        const files: GeneratedImageFile[] = [];

        for (let index = 0; index < data.length; index += 1) {
          const dataItem = data[index];
          if (!dataItem.b64_json) {
            throw new Error(`OpenAI image generation item ${index} has no b64_json field`);
          }

          const suffix = multipleOutputs
            ? `-${String(index + 1).padStart(2, "0")}`
            : "";
          const fileName = `${args.outputFilePrefix}${suffix}.${ext}`;
          const outputFile = path.join(outputDir, fileName);
          const imageBuffer = Buffer.from(dataItem.b64_json, "base64");
          await writeFile(outputFile, imageBuffer);

          files.push({
            file: outputFile,
            revisedPrompt: safeString(dataItem.revised_prompt) || undefined,
          });

          if (saveSidecarMetadataFile) {
            const sidecarPath = outputFile.replace(/\.[^.]+$/, ".json");
            await writeFile(
              sidecarPath,
              `${JSON.stringify(
                {
                  model,
                  size,
                  quality,
                  outputFormat,
                  outputCompression: args.outputCompression,
                  background,
                  user: args.user,
                  outputIndex: index,
                  revisedPrompt: safeString(dataItem.revised_prompt) || null,
                },
                null,
                "\t\t",
              )}\n`,
              "utf8",
            );
          }
        }

        this.log("info", `Image generated: ${files.length} file(s) written`);
        return { files };

      } catch (error) {
        if (attempt >= maxAttempts) throw error;
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    throw lastError ?? new Error("OpenAI image generation failed after retries");
  }
}
