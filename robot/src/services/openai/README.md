# OpenAI Service

OpenAI API adapter for runner task execution.

Implemented task methods:

- `generateImage`
  - uses `POST /v1/images/generations` when `inputImages` is not provided
  - uses `POST /v1/images/edits` when `inputImages` and/or `maskFile` is provided

Defaults:

- `model`: `gpt-image-1.5`
- `size`: `1024x1536`
- `quality`: `high`
- `n`: `1`
- `outputFormat`: `png`
- `saveSidecarMetadataFile`: `false`
- `generationTimeoutMs`: `180000`

Defaults are defined in `config.json` and loaded by `OpenAIService`.

Supported models:

- `gpt-image-2`
- `gpt-image-1.5`
- `gpt-image-1`
- `gpt-image-1-mini`

Validation highlights:

- if `maskFile` is provided, exactly one `inputImages` entry is required
- for `gpt-image-2`, `size` accepts `auto` or any `<width>x<height>` that meets API constraints
- for legacy models (`gpt-image-1.5`, `gpt-image-1`, `gpt-image-1-mini`), `size` is limited to `1024x1024`, `1024x1536`, `1536x1024`
- `background: "transparent"` is rejected for `gpt-image-2`

Recipe usage example:

```ts
export default {
  title: "OpenAI Example",
  steps: [
    {
      title: "Generate one image",
      taskId: "openai.generate-image",
      arguments: {
        prompt: "Futuristic cityscape at sunrise.",
        outputDir: "robot/tests/.tmp/examples/openai",
        outputFilePrefix: "sample",
        model: "gpt-image-1.5",
        size: "1024x1536",
        outputFormat: "png",
        saveSidecarMetadataFile: true,
      },
    },
  ],
};
```
