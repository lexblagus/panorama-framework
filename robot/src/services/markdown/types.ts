import type { ServiceBaseOptions } from "../base/index.js";

export type MarkdownServiceOptions = ServiceBaseOptions;

export interface MarkdownReadRequest {
  file: string;
}

export interface MarkdownInsertRequest {
  file: string;
  marker: string;
  content: string;
}
