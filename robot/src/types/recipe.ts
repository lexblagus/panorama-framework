import type { Step } from "./step.js";

export interface Recipe {
  title: string;
  description?: string;
  steps: Step[];
}

