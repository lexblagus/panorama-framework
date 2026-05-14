import type { ServiceBaseOptions } from "../base/index.js";

export type MarkdownServiceOptions = ServiceBaseOptions;

/**
 * Where the inserted content lands relative to the marker comment:
 * - `"before"` — immediately before the marker line
 * - `"after"` — immediately after the marker line (default)
 * - `"over"` — replaces the marker line itself
 * - `"between"` — replaces everything between a start/end marker pair
 */
export type MarkdownInsertPosition = "before" | "over" | "after" | "between";

/** Single HTML-comment marker name for `before`/`over`/`after`, or `[start, end]` pair for `between`. */
export type MarkdownInsertMarker = string | [string, string];

/** Full request descriptor for a `markdown.insert` task. */
export interface MarkdownInsertRequest {
  file: string;
  marker: MarkdownInsertMarker;
  content: string;
  position?: MarkdownInsertPosition;
}
