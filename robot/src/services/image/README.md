# Image Service

Local image processing capabilities used by runner tasks.

Implemented task methods:

- `createBridge`
- `composeTilesPreview`

`createBridge` requires equal input dimensions and keeps output dimensions equal to input dimensions. The output image has a transparent center band between the two crops.

`composeTilesPreview` is row-only in this phase and preserves `inputImages` order.

Validation:

- `createBridge`: both inputs must have identical dimensions; `leftCropWidth + rightCropWidth` must be less than image width.
- `composeTilesPreview`: all images must have identical dimensions; the first failing image is named in the error message.

Recipe usage example:

```ts
export default {
  title: "Image Example",
  steps: [
    {
      title: "Create bridge image",
      taskId: "image.create-bridge",
      arguments: {
        leftImageFile: "robot/tests/fixtures/images/left.png",
        rightImageFile: "robot/tests/fixtures/images/right.png",
        outputImageFile: "robot/tests/.tmp/examples/bridge.png",
        leftCropWidth: 341,
        rightCropWidth: 341,
      },
    },
    {
      title: "Compose preview strip",
      taskId: "image.compose-tiles",
      arguments: {
        inputImages: [
          "robot/tests/fixtures/images/tile1.png",
          "robot/tests/fixtures/images/tile2.png",
          "robot/tests/fixtures/images/tile3.png",
        ],
        outputImageFile: "robot/tests/.tmp/examples/preview-strip.png",
      },
    },
  ],
};
```
