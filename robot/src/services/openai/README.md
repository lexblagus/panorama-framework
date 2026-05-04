# OpenAI Service

OpenAI API adapter for runner task execution.

Implemented task methods:

- `generateImage` (`POST /v1/images/edits`)

Defaults:

- `model`: `gpt-image-1.5`
- `size`: `1024x1536`
- `quality`: `high`
- `n`: `1`
- `outputFormat`: `png`
- `saveSidecarMetadataFile`: `false`
- `generationTimeoutMs`: `180000`

Validation highlights:

- if `maskFile` is provided, exactly one `inputImages` entry is required
- `size` must be one of the strict enum values defined in service types
