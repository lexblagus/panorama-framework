import type { ServiceBaseOptions } from "../base/index.js";

export type ImageServiceOptions = ServiceBaseOptions;

export interface CreateBridgeArgs {
  leftImageFile: string;
  rightImageFile: string;
  outputImageFile: string;
  leftCropWidth: number;
  rightCropWidth: number;
}

export interface ComposeTilesPreviewArgs {
  inputImages: string[];
  outputImageFile: string;
}
