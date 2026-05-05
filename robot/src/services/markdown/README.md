# Markdown Service

`MarkdownService` provides deterministic markdown file operations:

- `read(targetPath)` returns full file contents.
- `write(file, content)` writes full file contents.
- `insert({ file, marker, content, position })` inserts content around markers.

Behavior rules:

- paths are resolved relative to `repoRootFolder` unless absolute
- insert `position` values:
- `before`: inserts before marker, marker preserved
- `after`: inserts after marker, marker preserved
- `over`: replaces marker with content
- `between`: requires `marker: [startMarker, endMarker]`; keeps both markers and replaces only the content between them
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
        targetPath: "framework/prompts/tile-01.md",
      },
    },
    {
      title: "Write markdown file",
      taskId: "markdown.write",
      arguments: {
        file: "robot/tests/.tmp/examples/output.md",
        content: "# generated markdown\n",
      },
    },
    {
      title: "Insert preview row",
      taskId: "markdown.insert",
      arguments: {
        file: "images/PREVIEW.md",
        marker: "robot:preview-table-first-row",
        content: "| example | row |",
        position: "before",
      },
    },
    {
      title: "Replace content between markers",
      taskId: "markdown.insert",
      arguments: {
        file: "robot/recipes/examples/markdown/read.md",
        marker: ["robot:content-start", "robot:content-end"],
        content: "new body block",
        position: "between",
      },
    },
  ],
};
```
