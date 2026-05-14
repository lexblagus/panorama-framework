import type { ServiceBaseOptions } from "../base/index.js";

export type ImageServiceOptions = ServiceBaseOptions;

/**
 * Arguments for the bridge composite operation: crops the right edge of the left tile and the
 * left edge of the right tile, then places them on opposite sides of a transparent center band.
 */
export interface CreateBridgeArgs {
  leftImageFile: string;
  rightImageFile: string;
  outputImageFile: string;
  leftCropWidth: number;
  rightCropWidth: number;
}

/** Arguments for compositing multiple equal-sized tiles into a single horizontal preview strip. */
export interface ComposeTilesPreviewArgs {
  inputImages: string[];
  outputImageFile: string;
}
