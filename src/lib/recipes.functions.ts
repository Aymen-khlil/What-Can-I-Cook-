import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateRecipes } from "./recipes.server";

const Input = z.object({
  ingredients: z.array(z.string().min(1)).min(1),
  maxMinutes: z.number().int().positive(),
});

export const findRecipes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => generateRecipes(data.ingredients, data.maxMinutes));
