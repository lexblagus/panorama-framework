import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

type CounterState = { counter: number };

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const recipeId = context.recipeId;

  // 1) Initialize only if missing
  const initial = await context.services.json.initializeRecipeState(recipeId, {
    counter: 0,
  } satisfies CounterState);

  // 2) Read current state
  const current =
    (await context.services.json.readRecipeState(recipeId)) ?? initial;

  const counter =
    typeof current.counter === "number" ? current.counter : 0;

  console.log(`counter=${counter}`);

  
  // 3) Persist updated state
  const nextValue = counter + 1;
  await context.services.json.writeRecipeState(recipeId, {
    ...current,
    counter: nextValue,
  });

  console.log(`nextValue=${nextValue}`, "\n");

  return {
    title: "Initialize, read and write state example",
    steps: [],
  };
}
