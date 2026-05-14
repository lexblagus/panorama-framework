import type { Step } from "./step.js";

/** In-memory recipe returned by a recipe module; converted to a `Plan` by the builder. */
export interface Recipe {
  title: string;
  description?: string;
  steps: Step[];
}

