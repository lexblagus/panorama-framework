export type TaskState = "waiting" | "running" | "success" | "error";

export type TaskId =
  | "openai.generate-image"
  | "openai.edit-image"
  | "openai.respond"
  | "image.create-bridge"
  | "image.compose-tiles"
  | "markdown.read"
  | "markdown.write"
  | "markdown.insert"
  | "json.read"
  | "json.write"
  | "workflow.run-recipe";

export interface Task {
  taskId: TaskId;
  title: string;
  description?: string;
  arguments: Record<string, unknown>;
  state: TaskState;
  errorMessage?: string;
  startedAt?: string;
  finishedAt?: string;
}
