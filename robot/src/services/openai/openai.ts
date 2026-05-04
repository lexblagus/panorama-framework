import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type OpenAIModel = "gpt-image-1.5" | "gpt-image-2";
export type OpenAIImageSize =
  | "1024x1024"
  | "1024x1536"
  | "1536x1024"
  | "2160x3840"
  | "3840x2160";
export type OpenAIImageQuality = "high" | "medium" | "low" | "auto";
export type OpenAIOutputFormat = "png" | "jpeg" | "webp";
export type OpenAIImageBackground = "transparent" | "opaque" | "auto";

export interface OpenAIServiceConfig {
  baseUrl: string;
  imageGenerationServicePath: string;
  imageEditServicePath: string;
  responsesServicePath: string;
  generationTimeoutMs: number;
}

export interface OpenAIServiceOptions {
  repoRoot: string;
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

interface OpenAIImageResponseDataItem {
  b64_json?: string;
  revised_prompt?: string;
}

interface OpenAIImageResponse {
  data?: OpenAIImageResponseDataItem[];
}

const DEFAULT_CONFIG: OpenAIServiceConfig = {
  baseUrl: "https://api.openai.com",
  imageGenerationServicePath: "/v1/images/edits",
  imageEditServicePath: "/v1/images/edits",
  responsesServicePath: "/v1/responses",
  generationTimeoutMs: 180000,
};

const ALLOWED_SIZES: ReadonlySet<OpenAIImageSize> = new Set([
  "1024x1024",
  "1024x1536",
  "1536x1024",
  "2160x3840",
  "3840x2160",
]);

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

function safeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export class OpenAIService {
  private readonly repoRoot: string;
  private readonly fetchImpl: typeof fetch;
  private readonly apiKey?: string;
  private readonly config: OpenAIServiceConfig;

  constructor(options: OpenAIServiceOptions) {
    this.repoRoot = options.repoRoot;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    this.config = {
      ...DEFAULT_CONFIG,
      ...options.config,
    };
  }

  private resolveRepoPath(targetPath: string): string {
    if (path.isAbsolute(targetPath)) {
      return targetPath;
    }
    return path.join(this.repoRoot, targetPath);
  }

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

    if (args.size !== undefined && !ALLOWED_SIZES.has(args.size)) {
      throw new Error(`Unsupported size "${args.size}"`);
    }

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
  }

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

  async generateImage(args: GenerateImageArgs): Promise<GenerateImageResult> {
    this.assertGenerateImageArgs(args);

    if (!this.apiKey) {
      throw new Error("OPENAI_API_KEY is required");
    }

    const model: OpenAIModel = args.model ?? "gpt-image-1.5";
    const size: OpenAIImageSize = args.size ?? "1024x1536";
    const quality: OpenAIImageQuality = args.quality ?? "high";
    const n = args.n ?? 1;
    const outputFormat: OpenAIOutputFormat = args.outputFormat ?? "png";
    const saveSidecarMetadataFile = args.saveSidecarMetadataFile ?? false;

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
    if (args.background !== undefined) {
      form.set("background", args.background);
    }
    if (args.user !== undefined) {
      form.set("user", args.user);
    }

    if (args.inputImages) {
      for (let index = 0; index < args.inputImages.length; index += 1) {
        const inputImagePath = this.resolveRepoPath(args.inputImages[index]);
        const buffer = await readFile(inputImagePath);
        form.append(
          "image[]",
          new Blob([buffer]),
          path.basename(inputImagePath),
        );
      }
    }

    if (args.maskFile) {
      const maskPath = this.resolveRepoPath(args.maskFile);
      const buffer = await readFile(maskPath);
      form.set("mask", new Blob([buffer]), path.basename(maskPath));
    }

    const timeoutMs = this.config.generationTimeoutMs;
    const response = await this.fetchImpl(
      `${this.config.baseUrl}${this.config.imageGenerationServicePath}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: form,
        signal: this.createTimeoutSignal(timeoutMs),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI image generation failed (${response.status}): ${body}`);
    }

    const json = (await response.json()) as unknown;
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
              background: args.background,
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

    return { files };
  }
}
