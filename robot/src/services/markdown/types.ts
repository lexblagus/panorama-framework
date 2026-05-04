export interface MarkdownServiceOptions {
  repoRoot: string;
}

export interface MarkdownReadRequest {
  file: string;
}

export interface MarkdownInsertRequest {
  file: string;
  marker: string;
  content: string;
}
