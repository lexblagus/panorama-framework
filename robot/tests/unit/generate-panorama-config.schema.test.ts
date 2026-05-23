import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  parseGeneratePanoramaConfig,
  generatePanoramaConfigSchema,
} from "../../recipes/generate-panorama/config.schema.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const robotRoot = path.resolve(__dirname, "../..");
const realConfigPath = path.join(
  robotRoot,
  "recipes",
  "generate-panorama",
  "config.json",
);

describe("generatePanoramaConfigSchema", () => {
  it("parses the checked-in generate-panorama config.json", async () => {
    const raw = JSON.parse(await readFile(realConfigPath, "utf8")) as unknown;
    const parsed = parseGeneratePanoramaConfig(raw);
    expect(parsed.filePrefix).toMatch(/^[0-9]+$/);
    expect(parsed.compositionMapsR1.tile5).toMatch(/\.png$/);
    expect(parsed.image.leftCropWidth).toBe(341);
    expect(parsed.frameworkHomeCompositionMarkers).toHaveLength(2);
    expect(parsed.layoutCalibrationPass.enabled).toBe(true);
    expect(parsed.layoutCalibrationPass.promptFile).toBe("layout-calibration-pass.md");
    expect(parsed.addToPreviewTableRowPre).toBe(true);
    expect(parsed.addToPreviewTableRowPost).toBe(true);
    expect(parsed.addToPreviewTableRowOverlay).toBe(true);
    expect(parsed.addToPreviewTableRowPanorama).toBe(true);
  });

  it("rejects missing required keys", () => {
    expect(() =>
      parseGeneratePanoramaConfig({
        promptFolder: "x",
        filePrefix: "012",
      }),
    ).toThrow(/Invalid generate-panorama config/);
  });

  it("rejects invalid outputCompression", async () => {
    const raw = JSON.parse(await readFile(realConfigPath, "utf8")) as Record<
      string,
      unknown
    >;
    const image = { ...(raw.image as Record<string, unknown>) };
    image.outputCompression = 101;
    raw.image = image;
    expect(() => parseGeneratePanoramaConfig(raw)).toThrow(/outputCompression/);
  });

  it("strips unknown top-level keys without failing", async () => {
    const raw = JSON.parse(await readFile(realConfigPath, "utf8")) as Record<
      string,
      unknown
    >;
    raw.REM_samples = 3;
    const parsed = parseGeneratePanoramaConfig(raw);
    expect("REM_samples" in parsed).toBe(false);
    expect(generatePanoramaConfigSchema.parse(raw).filePrefix).toBe(parsed.filePrefix);
  });
});
