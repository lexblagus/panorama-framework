import type { TaskId } from "./task.js";

export interface Step {
  title: string;
  description?: string;
  taskId: TaskId;
  arguments: Record<string, unknown>;
}

