export type Recipe = {
  name: string;
  minutes: number;
  difficulty: string;
  description: string;
  uses: string[];
  missing: string[];
  ingredients: { item: string; quantity: string }[];
  steps: string[];
};
