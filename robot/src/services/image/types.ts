export interface ImageServiceOptions {
  repoRoot: string;
}

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
