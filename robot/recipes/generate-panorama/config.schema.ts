import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "must be a non-empty string");

const promptFilesSchema = z.object({
  masterBase: nonEmpty,
  masterOnly: nonEmpty,
  tile1: nonEmpty,
  tile2: nonEmpty,
  tile3: nonEmpty,
  tile4: nonEmpty,
  tile5: nonEmpty,
  tile6: nonEmpty,
  tile7: nonEmpty,
  tile8: nonEmpty,
  tile9: nonEmpty,
});

const compositionMapsR1Schema = z.object({
  tile1: nonEmpty,
  tile2: nonEmpty,
  tile3: nonEmpty,
  tile4: nonEmpty,
  tile5: nonEmpty,
  tile6: nonEmpty,
  tile7: nonEmpty,
  tile8: nonEmpty,
  tile9: nonEmpty,
});

const imageSchema = z.object({
  model: nonEmpty,
  quality: nonEmpty,
  outputFormat: nonEmpty,
  outputCompression: z
    .number()
    .int("outputCompression must be an integer")
    .min(0)
    .max(100),
  masterSize: nonEmpty,
  tileSize: nonEmpty,
  leftCropWidth: z.number().int().positive(),
  rightCropWidth: z.number().int().positive(),
});

export const generatePanoramaConfigSchema = z.object({
  promptFolder: nonEmpty,
  promptFiles: promptFilesSchema,
  generatedImagePath: nonEmpty,
  filePrefix: nonEmpty,
  fileIndex: z.number().int().min(0),
  masterSamples: z.number().int().min(1),
  fileIndexPaddingZeroes: z.number().int().min(1),
  samplePaddingZeroes: z.number().int().min(1),
  image: imageSchema,
  previewMarkDownFile: nonEmpty,
  previewCompositionMarker: nonEmpty,
  previewTilesTableMarker: nonEmpty,
  frameworkHomeMarkDownFile: nonEmpty,
  frameworkHomeCompositionMarkers: z
    .array(nonEmpty)
    .min(1, "frameworkHomeCompositionMarkers must have at least one marker"),
  compositionMapsR1Folder: nonEmpty,
  compositionMapsR1: compositionMapsR1Schema,
});

export type GeneratePanoramaConfig = z.infer<typeof generatePanoramaConfigSchema>;

function formatConfigParseError(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
      return `  - ${path}: ${issue.message}`;
    })
    .join("\n");
}

export function parseGeneratePanoramaConfig(input: unknown): GeneratePanoramaConfig {
  const result = generatePanoramaConfigSchema.safeParse(input);
  if (!result.success) {
    const detail = formatConfigParseError(result.error);
    throw new Error(`Invalid generate-panorama config.json:\n${detail}`);
  }
  return result.data;
}
