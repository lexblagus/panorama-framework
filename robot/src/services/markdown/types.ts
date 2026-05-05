import type { ServiceBaseOptions } from "../base/index.js";

export type MarkdownServiceOptions = ServiceBaseOptions;

export type MarkdownInsertPosition = "before" | "over" | "after" | "between";
export type MarkdownInsertMarker = string | [string, string];

export interface MarkdownInsertRequest {
  file: string;
  marker: MarkdownInsertMarker;
  content: string;
  position?: MarkdownInsertPosition;
}
