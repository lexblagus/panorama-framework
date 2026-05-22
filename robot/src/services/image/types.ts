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

export type AssembleLayersPosition =
  | "top-left"    | "top-center"    | "top-right"
  | "middle-left" | "middle-center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

export interface AssembleLayersInput {
  imageFile: string;
  /** @default "middle-center" */
  position?: AssembleLayersPosition;
}

/**
 * Arguments for stacking images as layers on a transparent canvas.
 * First input is the background; last input is the foreground.
 * Canvas size defaults to the bounding box of all inputs when width/height are omitted.
 */
export interface AssembleLayersArgs {
  inputs: (AssembleLayersInput | string)[];
  output: {
    imageFile: string;
    /** @default "png" */
    format?: "png" | "jpeg" | "webp";
    width?: number;
    height?: number;
  };
}
