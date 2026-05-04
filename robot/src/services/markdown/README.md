# Markdown Service

`MarkdownService` provides deterministic markdown file operations:

- `read({ file })` returns full file contents.
- `insert({ file, marker, content })` inserts content after `<!-- <marker> -->`.

Behavior rules:

- paths are resolved relative to `repoRoot` unless absolute
- missing markers fail with `insert marker not found`
- text outside the insertion point is preserved exactly

