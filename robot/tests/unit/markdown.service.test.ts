import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { MarkdownService } from "../../src/services/markdown/index.js";

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(
    tempRoots.splice(0).map(async (root) => {
      await rm(root, { recursive: true, force: true });
    }),
  );
});

async function createTempRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "robot-markdown-service-"));
  tempRoots.push(root);
  return root;
}

async function createServices(): Promise<{
  root: string;
  markdown: MarkdownService;
}> {
  const root = await createTempRoot();
  return {
    root,
    markdown: new MarkdownService({ repoRoot: root }),
  };
}

describe("MarkdownService", () => {
  it("reads full file contents as stored", async () => {
    const { root, markdown } = await createServices();
    const file = "docs/read.md";
    const source = "line 1\nline 2\n";

    await mkdir(path.join(root, "docs"), { recursive: true });
    await writeFile(path.join(root, file), source, "utf8");
    const loaded = await markdown.read({ file });

    expect(loaded).toBe(source);
  });

  it("inserts content after marker and preserves other text", async () => {
    const { root, markdown } = await createServices();
    const file = path.join(root, "docs", "preview.md");
    const source = [
      "# Preview",
      "",
      "<!-- robot:preview-table-first-row -->",
      "| Existing | Row |",
      "",
      "footer",
      "",
    ].join("\n");

    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, source, "utf8");

    await markdown.insert({
      file,
      marker: "robot:preview-table-first-row",
      content: "| New | Entry |",
    });

    const output = await readFile(file, "utf8");
    const expected = [
      "# Preview",
      "",
      "<!-- robot:preview-table-first-row -->",
      "| New | Entry |",
      "| Existing | Row |",
      "",
      "footer",
      "",
    ].join("\n");

    expect(output).toBe(expected);
  });

  it("fails when insert marker is missing", async () => {
    const { root, markdown } = await createServices();
    const file = path.join(root, "docs", "preview.md");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, "no marker here", "utf8");

    await expect(
      markdown.insert({
        file,
        marker: "robot:preview-table-first-row",
        content: "| New | Entry |",
      }),
    ).rejects.toThrow("insert marker not found");
  });
});
