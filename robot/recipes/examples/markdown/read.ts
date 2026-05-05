import type { BuildRecipeContext } from "../../../src/types/builder.js";
import type { Recipe } from "../../../src/types/recipe.js";

export async function buildRecipe(
  context: BuildRecipeContext,
): Promise<Recipe> {
  const mdFile = `${context.robotPackageFolder}/recipes/${context.recipeId}.example.md`;

  const mdContents = await context.services.markdown.read(mdFile);

  console.log(`Markdown contents: \`\`\`\n${mdContents}\`\`\`\n`);

  return {
    title: "Read MarkDown recipe example",
    steps: [],
  };
}
