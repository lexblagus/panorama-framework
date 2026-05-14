import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";
import Log from "../../../src/utils/log.ts";

type CounterState = { counter: number };

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const log = new Log("recipe", "magenta");
  log("info", "Initialize, read and write recipe state example");

  const recipeId = context.recipeId;

  // 1) Initialize only if missing
  const initial = await context.services.json.initializeRecipeState(recipeId, {
    counter: 0,
  } satisfies CounterState);

  // 2) Read current state
  const state =
    (await context.services.json.readRecipeState(recipeId)) ?? initial;

  const counter =
    typeof state.counter === "number" ? state.counter : 0;

  log("debug", `counter=${counter}`);

  // 3) Persist updated state
  const nextValue = counter + 1;
  await context.services.json.writeRecipeState(recipeId, {
    ...state,
    counter: nextValue,
  });

  log("debug", `nextValue=${nextValue}`);

  return {
    title: "Initialize, read and write state example",
    steps: [],
  };
}
