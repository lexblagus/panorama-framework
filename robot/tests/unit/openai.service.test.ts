import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  OpenAIService,
  type GenerateImageArgs,
} from "../../src/services/openai/index.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map(async (root) => {
      await rm(root, { recursive: true, force: true });
    }),
  );
});

async function createTempRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "robot-openai-service-"));
  tempRoots.push(root);
  return root;
}

const ONE_PIXEL_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=";

function buildDefaultArgs(root: string): GenerateImageArgs {
  return {
    prompt: "test prompt",
    outputDir: path.join(root, "out"),
    outputFilePrefix: "generated",
  };
}

describe("OpenAIService", () => {
  it("applies defaults and calls images edits endpoint", async () => {
    const root = await createTempRoot();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      expect(String(input)).toBe("https://api.openai.com/v1/images/edits");
      expect(init?.method).toBe("POST");
      expect(init?.headers).toEqual({ Authorization: "Bearer test-key" });
      expect(init?.signal).toBeDefined();

      const form = init?.body as FormData;
      expect(form.get("model")).toBe("gpt-image-1.5");
      expect(form.get("size")).toBe("1024x1536");
      expect(form.get("quality")).toBe("high");
      expect(form.get("n")).toBe("1");
      expect(form.get("output_format")).toBe("png");

      return new Response(
        JSON.stringify({
          data: [{ b64_json: ONE_PIXEL_PNG_BASE64 }],
        }),
        { status: 200 },
      );
    });

    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await service.generateImage(buildDefaultArgs(root));
    expect(result.files).toHaveLength(1);
    expect(path.basename(result.files[0].file)).toBe("generated.png");
    const imageStat = await stat(result.files[0].file);
    expect(imageStat.size).toBeGreaterThan(0);
  });

  it("requires exactly one input image when maskFile is provided", async () => {
    const root = await createTempRoot();
    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });

    await expect(
      service.generateImage({
        ...buildDefaultArgs(root),
        maskFile: "mask.png",
        inputImages: ["one.png", "two.png"],
      }),
    ).rejects.toThrow("maskFile requires exactly one input image");
  });

  it("rejects unsupported size values at runtime", async () => {
    const root = await createTempRoot();
    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });

    await expect(
      service.generateImage({
        ...buildDefaultArgs(root),
        size: "999x999" as never,
      }),
    ).rejects.toThrow('Unsupported size "999x999" for model "gpt-image-1.5"');
  });

  it("saves sidecar metadata file when requested", async () => {
    const root = await createTempRoot();
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          data: [{ b64_json: ONE_PIXEL_PNG_BASE64, revised_prompt: "rev" }],
        }),
        { status: 200 },
      ));

    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await service.generateImage({
      ...buildDefaultArgs(root),
      saveSidecarMetadataFile: true,
      outputFormat: "webp",
    });

    const output = result.files[0].file;
    expect(path.extname(output)).toBe(".webp");
    const sidecar = output.replace(/\.[^.]+$/, ".json");
    const sidecarJson = JSON.parse(await readFile(sidecar, "utf8")) as Record<string, unknown>;
    expect(sidecarJson.outputFormat).toBe("webp");
    expect(sidecarJson.revisedPrompt).toBe("rev");
  });

  it("uploads single input image and mask files when provided", async () => {
    const root = await createTempRoot();
    const inputPath = path.join(root, "input.png");
    const maskPath = path.join(root, "mask.png");
    await writeFile(inputPath, Buffer.from(ONE_PIXEL_PNG_BASE64, "base64"));
    await writeFile(maskPath, Buffer.from(ONE_PIXEL_PNG_BASE64, "base64"));

    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const form = init?.body as FormData;
      expect(form.getAll("image[]")).toHaveLength(1);
      expect(form.get("mask")).toBeTruthy();
      return new Response(
        JSON.stringify({
          data: [{ b64_json: ONE_PIXEL_PNG_BASE64 }],
        }),
        { status: 200 },
      );
    });

    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    const result = await service.generateImage({
      ...buildDefaultArgs(root),
      inputImages: [inputPath],
      maskFile: maskPath,
      model: "gpt-image-2",
      size: "2160x3840",
    });

    expect(result.files).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("accepts all GPT image model ids supported by this service", async () => {
    const root = await createTempRoot();
    const acceptedModels = [
      "gpt-image-2",
      "gpt-image-1.5",
      "gpt-image-1",
      "gpt-image-1-mini",
    ] as const;

    for (const model of acceptedModels) {
      const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        const form = init?.body as FormData;
        expect(form.get("model")).toBe(model);
        return new Response(
          JSON.stringify({
            data: [{ b64_json: ONE_PIXEL_PNG_BASE64 }],
          }),
          { status: 200 },
        );
      });
      const service = new OpenAIService({
        repoRoot: root,
        apiKey: "test-key",
        fetchImpl: fetchMock as unknown as typeof fetch,
      });

      await service.generateImage({
        ...buildDefaultArgs(root),
        model,
      });
    }
  });

  it("accepts constrained dynamic sizes for gpt-image-2", async () => {
    const root = await createTempRoot();
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          data: [{ b64_json: ONE_PIXEL_PNG_BASE64 }],
        }),
        { status: 200 },
      ));
    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    await expect(
      service.generateImage({
        ...buildDefaultArgs(root),
        model: "gpt-image-2",
        size: "2048x1152",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        files: expect.any(Array),
      }),
    );
  });

  it("rejects transparent background for gpt-image-2", async () => {
    const root = await createTempRoot();
    const service = new OpenAIService({
      repoRoot: root,
      apiKey: "test-key",
      fetchImpl: vi.fn() as unknown as typeof fetch,
    });

    await expect(
      service.generateImage({
        ...buildDefaultArgs(root),
        model: "gpt-image-2",
        background: "transparent",
      }),
    ).rejects.toThrow(
      'background "transparent" is not supported for model "gpt-image-2"',
    );
  });
});
