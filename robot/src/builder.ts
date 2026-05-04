export interface BuildCommandInput {
  recipeId: string;
}

export interface BuildCommandResult {
  scaffold: true;
  command: "build";
  recipeId: string;
  planId: string;
}

export async function buildCommand(
  input: BuildCommandInput,
): Promise<BuildCommandResult> {
  return {
    scaffold: true,
    command: "build",
    recipeId: input.recipeId,
    planId: input.recipeId,
  };
}

