# Markdown Service

`MarkdownService` provides deterministic markdown file operations:

- `read({ file })` returns full file contents.
- `insert({ file, marker, content })` inserts content after `<!-- <marker> -->`.

Behavior rules:

- paths are resolved relative to `repoRootFolder` unless absolute
- missing markers fail with `insert marker not found`
- text outside the insertion point is preserved exactly

Recipe usage example:

```ts
export default {
  title: "Markdown Example",
  steps: [
    {
      title: "Read source markdown",
      taskId: "markdown.read",
      arguments: {
        file: "framework/prompts/tile-01.md",
      },
    },
    {
      title: "Insert preview row",
      taskId: "markdown.insert",
      arguments: {
        file: "images/PREVIEW.md",
        marker: "robot:preview-table-first-row",
        content: "| example | row |",
      },
    },
  ],
};
```
