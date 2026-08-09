import type { Recipe } from "./recipe-types";

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function mockRecipes(ingredients: string[], maxMinutes: number): Recipe[] {
  const has = (n: string) => ingredients.some((i) => i.toLowerCase().includes(n));
  const base: Recipe[] = [
    {
      name: "Rustic Tomato Omelette",
      minutes: 20,
      difficulty: "Easy",
      description: "Fluffy eggs folded over sweet blistered tomatoes and softened onion.",
      uses: ["Eggs", "Tomatoes", "Onion"],
      missing: ["Parsley"],
      ingredients: [
        { item: "Eggs", quantity: "3 large" },
        { item: "Tomatoes", quantity: "2 medium, diced" },
        { item: "Onion", quantity: "1/2, thinly sliced" },
        { item: "Butter", quantity: "1 tbsp" },
        { item: "Salt & pepper", quantity: "to taste" },
      ],
      steps: [
        "Whisk the eggs with a pinch of salt until pale and airy.",
        "Soften the onion in butter over medium heat, 3 minutes.",
        "Add tomatoes and cook until they collapse, 4 minutes.",
        "Pour in the eggs, swirl, and cook until just set.",
        "Fold, slide onto a plate and finish with cracked pepper.",
      ],
    },
    {
      name: "Golden Cheese Toasties",
      minutes: 10,
      difficulty: "Easy",
      description: "Crisp buttered bread with a molten cheese centre — five minutes to happy.",
      uses: ["Bread", "Cheese", "Butter"],
      missing: [],
      ingredients: [
        { item: "Bread", quantity: "4 slices" },
        { item: "Cheese", quantity: "120 g, grated" },
        { item: "Butter", quantity: "2 tbsp, softened" },
      ],
      steps: [
        "Butter the outside of every slice of bread.",
        "Pile the cheese between two slices, press gently.",
        "Toast in a dry pan over medium-low heat, 3 minutes per side.",
        "Rest one minute, then cut on the diagonal.",
      ],
    },
    {
      name: "Slow Onion & Tomato Ragu",
      minutes: 60,
      difficulty: "Medium",
      description: "Deeply caramelised onions simmered with tomatoes into a silky, savoury sauce.",
      uses: ["Onion", "Tomatoes", "Olive oil"],
      missing: ["Garlic", "Basil"],
      ingredients: [
        { item: "Onions", quantity: "3 large, sliced" },
        { item: "Tomatoes", quantity: "800 g, chopped" },
        { item: "Olive oil", quantity: "3 tbsp" },
        { item: "Garlic", quantity: "3 cloves" },
      ],
      steps: [
        "Cook onions in olive oil on low for 25 minutes until jammy.",
        "Stir in garlic for one minute.",
        "Add tomatoes, season, and simmer 30 minutes uncovered.",
        "Blend lightly for a silkier sauce, or leave rustic.",
      ],
    },
    {
      name: "Skillet Egg & Cheese Bake",
      minutes: 30,
      difficulty: "Easy",
      description: "Eggs baked into a bubbling tomato base with a blanket of melted cheese.",
      uses: ["Eggs", "Tomatoes", "Cheese"],
      missing: ["Paprika"],
      ingredients: [
        { item: "Eggs", quantity: "4" },
        { item: "Tomatoes", quantity: "400 g, crushed" },
        { item: "Cheese", quantity: "80 g" },
        { item: "Onion", quantity: "1, diced" },
      ],
      steps: [
        "Soften onion in a skillet, add tomatoes and simmer 10 minutes.",
        "Make four wells and crack an egg into each.",
        "Scatter cheese over the top.",
        "Cover and cook 8-10 minutes until whites are set.",
      ],
    },
  ];

  const personalised = base.map((r) => ({
    ...r,
    uses: r.uses.map((u) => (has(u.toLowerCase()) ? u : u)),
  }));

  const extra = ingredients.slice(0, 3).map(cap).join(", ");
  if (extra) {
    personalised.push({
      name: `${cap(ingredients[0] ?? "Pantry")} Skillet Supper`,
      minutes: Math.min(maxMinutes, 30),
      difficulty: "Easy",
      description: `A quick one-pan dinner built around ${extra}.`,
      uses: ingredients.slice(0, 4).map(cap),
      missing: ["Lemon"],
      ingredients: ingredients.slice(0, 4).map((i) => ({ item: cap(i), quantity: "as needed" })),
      steps: [
        "Heat a splash of oil in your widest pan.",
        `Add ${extra} and cook until fragrant and lightly coloured.`,
        "Season generously, add a splash of water and cover for 5 minutes.",
        "Taste, adjust, and serve hot.",
      ],
    });
  }

  return personalised.filter((r) => r.minutes <= maxMinutes).slice(0, 5).length
    ? personalised.filter((r) => r.minutes <= maxMinutes).slice(0, 5)
    : personalised.slice(0, 3);
}
