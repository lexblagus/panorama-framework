# Image Service

Local image processing capabilities used by runner tasks.

Implemented task methods:

- `createBridge`
- `composeTilesPreview`

`createBridge` requires equal input dimensions and keeps output dimensions equal to input dimensions.

`composeTilesPreview` is row-only in this phase and preserves `inputImages` order.
