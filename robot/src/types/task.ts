/** Lifecycle states of a task as persisted in the plan JSON. */
export type TaskState = "waiting" | "running" | "success" | "error";

/** All valid task identifiers; each maps to exactly one service method. */
export type TaskId =
  | "openai.generate-image"
  | "image.create-bridge"
  | "image.compose-tiles"
  | "markdown.read"
  | "markdown.write"
  | "markdown.insert"
  | "json.read"
  | "json.write"
  | "workflow.run-recipe";

/** Runtime task record stored inside a plan; mutated in-place as execution progresses. */
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
