import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { mockRecipes } from "./recipes.mock";
import type { Recipe } from "./recipe-types";

const RecipeItem = z.object({
  name: z.string(),
  minutes: z.number(),
  difficulty: z.string(),
  description: z.string(),
  uses: z.array(z.string()),
  missing: z.array(z.string()),
  ingredients: z.array(z.object({ item: z.string(), quantity: z.string() })),
  steps: z.array(z.string()),
});

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^```(?:json)?/gm, "")
    .replace(/```$/gm, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.search(/[[{]/);
    const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
    if (start === -1 || end === -1) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

export async function generateRecipes(
  ingredients: string[],
  maxMinutes: number,
): Promise<{ recipes: Recipe[]; source: "ai" | "mock" }> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) return { recipes: mockRecipes(ingredients, maxMinutes), source: "mock" };

  try {
    const gateway = createLovableAiGatewayProvider(key);
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      system:
        "You are a warm, practical home-cooking assistant. Suggest realistic recipes that mostly use the ingredients the cook already has, plus common pantry staples. Keep missing ingredients to a minimum. Reply with raw JSON only, no markdown fences, no commentary.",
      prompt: `Ingredients on hand: ${ingredients.join(", ")}.
Maximum cooking time: ${maxMinutes} minutes.

Return a JSON object exactly of this shape:
{"recipes":[{"name":string,"minutes":number,"difficulty":"Easy"|"Medium"|"Hard","description":string,"uses":string[],"missing":string[],"ingredients":[{"item":string,"quantity":string}],"steps":string[]}]}

Rules: exactly 4 recipes, each within the time limit. "uses" lists only ingredients the cook already has; "missing" lists anything else essential (may be empty). "steps" has 4-7 short imperative sentences. "description" is one appetising sentence.`,
    });

    const raw = extractJson(text);
    const list = Array.isArray(raw)
      ? raw
      : ((raw as { recipes?: unknown })?.recipes ?? null);
    const parsed = z.array(RecipeItem).min(1).max(6).safeParse(list);
    if (!parsed.success) throw new Error("Unexpected AI response shape");

    return { recipes: parsed.data as Recipe[], source: "ai" };
  } catch (err) {
    console.error("AI recipe generation failed, falling back to mock data", err);
    return { recipes: mockRecipes(ingredients, maxMinutes), source: "mock" };
  }
}
