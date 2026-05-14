import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BaseService } from "../base/index.js";
import type {
  MarkdownInsertRequest,
  MarkdownServiceOptions,
} from "./types.js";

export class MarkdownService extends BaseService {
  constructor(options: MarkdownServiceOptions) {
    super(options);
  }

  async read(targetPath: string): Promise<string> {
    const absolutePath = this.resolveRepoPath(targetPath);
    return readFile(absolutePath, "utf8");
  }

  async write(file: string, content: string): Promise<void> {
    const absolutePath = this.resolveRepoPath(file);
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
  }

  async insert(request: MarkdownInsertRequest): Promise<void> {
    const position = request.position ?? "after";
    this.log("debug", `Inserting markdown (${position}) in "${request.file}"`);
    const absolutePath = this.resolveRepoPath(request.file);
    const source = await readFile(absolutePath, "utf8");
    const lineBreak = source.includes("\r\n") ? "\r\n" : "\n";

    if (position === "between") {
      if (!Array.isArray(request.marker) || request.marker.length !== 2) {
        throw new Error('position "between" requires marker as [startMarker, endMarker]');
      }

      const [startMarker, endMarker] = request.marker;
      if (
        typeof startMarker !== "string" ||
        !startMarker.trim() ||
        typeof endMarker !== "string" ||
        !endMarker.trim()
      ) {
        throw new Error('position "between" requires marker as [startMarker, endMarker]');
      }

      const startComment = `<!-- ${startMarker} -->`;
      const endComment = `<!-- ${endMarker} -->`;
      const startIndex = source.indexOf(startComment);
      if (startIndex === -1) {
        throw new Error(`insert start marker not found: "${startMarker}"`);
      }
      const endIndex = source.indexOf(endComment, startIndex + startComment.length);
      if (endIndex === -1) {
        throw new Error(`insert end marker not found: "${endMarker}"`);
      }
      if (startIndex >= endIndex) {
        throw new Error("between markers order invalid");
      }

      const betweenStartBase = startIndex + startComment.length;
      let replaceStart = betweenStartBase;
      if (source.startsWith("\r\n", replaceStart)) {
        replaceStart += 2;
      } else if (source.startsWith("\n", replaceStart)) {
        replaceStart += 1;
      }

      let replaceEnd = endIndex;
      if (
        replaceEnd >= 2 &&
        source.slice(replaceEnd - 2, replaceEnd) === "\r\n"
      ) {
        replaceEnd -= 2;
      } else if (replaceEnd >= 1 && source[replaceEnd - 1] === "\n") {
        replaceEnd -= 1;
      }

      const contentForBetween =
        request.content.endsWith("\n") ||
        request.content.endsWith("\r\n") ||
        source.slice(replaceEnd).startsWith("\n") ||
        source.slice(replaceEnd).startsWith("\r\n")
          ? request.content
          : `${request.content}${lineBreak}`;

      const output =
        source.slice(0, replaceStart) +
        contentForBetween +
        source.slice(replaceEnd);

      await mkdir(path.dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, output, "utf8");
      return;
    }

    if (Array.isArray(request.marker)) {
      throw new Error('position "before" | "over" | "after" requires marker as string');
    }

    const markerComment = `<!-- ${request.marker} -->`;
    const markerIndex = source.indexOf(markerComment);
    if (markerIndex === -1) {
      throw new Error("insert marker not found");
    }

    const afterMarkerIndex = markerIndex + markerComment.length;
    const contentWithLineBreak = request.content.endsWith("\n") ||
      request.content.endsWith("\r\n")
      ? request.content
      : `${request.content}${lineBreak}`;

    let output: string;

    if (position === "over") {
      const nextChunk = source.slice(afterMarkerIndex);
      const contentForReplace =
        request.content.endsWith("\n") ||
        request.content.endsWith("\r\n") ||
        nextChunk.startsWith("\n") ||
        nextChunk.startsWith("\r\n")
          ? request.content
          : `${request.content}${lineBreak}`;
      output =
        source.slice(0, markerIndex) +
        contentForReplace +
        source.slice(afterMarkerIndex);
    } else {
      let insertIndex = markerIndex;
      if (position === "after") {
        insertIndex = afterMarkerIndex;
        if (source.startsWith("\r\n", insertIndex)) {
          insertIndex += 2;
        } else if (source.startsWith("\n", insertIndex)) {
          insertIndex += 1;
        }
      }
      output =
        source.slice(0, insertIndex) +
        contentWithLineBreak +
        source.slice(insertIndex);
    }

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, output, "utf8");
  }
}
