import type { Recipe } from "../../src/types/recipe.js";

/**
 * Minimal recipe used exclusively by the CLI E2E test suite.
 *
 * Step layout:
 *   1. json.write  → robot/transient/e2e-cli-step1.json
 *   2. workflow.stop (intentional halt — resume auto-skips this)
 *   3. json.write  → robot/transient/e2e-cli-step3.json
 *
 * This lets the tests verify that `exec` stops at step 2, and `resume` continues to step 3.
 */
const recipe: Recipe = {
  title: "CLI E2E test",
  steps: [
    {
      title: "Write step-1 output",
      taskId: "json.write",
      arguments: { file: "robot/transient/e2e-cli-step1.json", value: { step: 1 } },
    },
    {
      title: "Stop",
      taskId: "workflow.stop",
      arguments: {},
    },
    {
      title: "Write step-3 output",
      taskId: "json.write",
      arguments: { file: "robot/transient/e2e-cli-step3.json", value: { step: 3 } },
    },
  ],
};

export default recipe;
