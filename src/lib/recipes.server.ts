import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { mockRecipes } from "./recipes.mock";
import type { Recipe } from "./recipe-types";

const RecipeSchema = z.object({
  recipes: z
    .array(
      z.object({
        name: z.string(),
        minutes: z.number(),
        difficulty: z.string(),
        description: z.string(),
        uses: z.array(z.string()),
        missing: z.array(z.string()),
        ingredients: z.array(z.object({ item: z.string(), quantity: z.string() })),
        steps: z.array(z.string()),
      }),
    )
    .min(3)
    .max(5),
});

export async function generateRecipes(
  ingredients: string[],
  maxMinutes: number,
): Promise<{ recipes: Recipe[]; source: "ai" | "mock" }> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return { recipes: mockRecipes(ingredients, maxMinutes), source: "mock" };

  try {
    const gateway = createLovableAiGatewayProvider(key);
    const result = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      output: Output.object({ schema: RecipeSchema }),
      system:
        "You are a warm, practical home-cooking assistant. Suggest realistic recipes that mostly use the ingredients the cook already has, plus common pantry staples. Keep missing ingredients to a minimum and clearly listed.",
      prompt: `Ingredients on hand: ${ingredients.join(", ")}.
Maximum cooking time: ${maxMinutes} minutes.
Return 4 recipes, each within the time limit. "uses" must list only ingredients the cook already has; "missing" lists anything else essential. Steps should be 4-7 short imperative sentences.`,
    });
    const output = await result.output;
    return { recipes: output.recipes as Recipe[], source: "ai" };
  } catch (err) {
    console.error("AI recipe generation failed, falling back to mock data", err);
    return { recipes: mockRecipes(ingredients, maxMinutes), source: "mock" };
  }
}
