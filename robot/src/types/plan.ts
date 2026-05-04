import type { Task } from "./task.js";

export interface Plan {
  recipeId: string;
  createdAt: string;
  tasks: Task[];
}

