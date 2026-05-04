import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BaseService } from "../base/index.js";
import type {
  MarkdownInsertRequest,
  MarkdownReadRequest,
  MarkdownServiceOptions,
} from "./types.js";

export class MarkdownService extends BaseService {
  constructor(options: MarkdownServiceOptions) {
    super(options);
  }

  async read(request: MarkdownReadRequest): Promise<string> {
    const absolutePath = this.resolveRepoPath(request.file);
    return readFile(absolutePath, "utf8");
  }

  async insert(request: MarkdownInsertRequest): Promise<void> {
    const absolutePath = this.resolveRepoPath(request.file);
    const source = await readFile(absolutePath, "utf8");

    const markerComment = `<!-- ${request.marker} -->`;
    const markerIndex = source.indexOf(markerComment);
    if (markerIndex === -1) {
      throw new Error("insert marker not found");
    }

    const afterMarkerIndex = markerIndex + markerComment.length;
    let insertIndex = afterMarkerIndex;
    let lineBreak = "\n";

    if (source.startsWith("\r\n", afterMarkerIndex)) {
      lineBreak = "\r\n";
      insertIndex += 2;
    } else if (source.startsWith("\n", afterMarkerIndex)) {
      insertIndex += 1;
    }

    const contentWithLineBreak = request.content.endsWith("\n") ||
      request.content.endsWith("\r\n")
      ? request.content
      : `${request.content}${lineBreak}`;

    const output =
      source.slice(0, insertIndex) +
      contentWithLineBreak +
      source.slice(insertIndex);

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, output, "utf8");
  }
}
