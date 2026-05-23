import { z } from "zod";
import type { Task } from "./task.js";

/** Serialised plan written to `robot/plans/<planId>.json`; task states are updated in-place during execution. */
export interface Plan {
  recipeId: string;
  createdAt: string;
  tasks: Task[];
}

const taskStateSchema = z.enum(["waiting", "running", "success", "error"]);

const taskIdSchema = z.enum([
  "openai.generate-image",
  "image.create-bridge",
  "image.compose-tiles",
  "image.assemble-layers",
  "markdown.read",
  "markdown.write",
  "markdown.insert",
  "json.read",
  "json.write",
  "workflow.run-recipe",
  "workflow.stop",
]);

const taskSchema = z.object({
  taskId: taskIdSchema,
  title: z.string(),
  description: z.string().optional(),
  arguments: z.record(z.unknown()),
  state: taskStateSchema,
  errorMessage: z.string().optional(),
  startedAt: z.string().optional(),
  finishedAt: z.string().optional(),
});

/** Zod schema used to parse and validate plan JSON loaded from disk at runtime. */
export const planSchema = z.object({
  recipeId: z.string(),
  createdAt: z.string(),
  tasks: z.array(taskSchema),
});
