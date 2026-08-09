import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import { ChefHat, Clock, Flame, Loader2, Plus, Sparkles, X } from "lucide-react";

import heroImage from "@/assets/hero-ingredients.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { findRecipes } from "@/lib/recipes.functions";
import type { Recipe } from "@/lib/recipe-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "What Can I Cook? — Recipes From What You Have" },
      {
        name: "description",
        content:
          "Type the ingredients in your kitchen and get instant recipe ideas with times, steps and what you're missing.",
      },
      { property: "og:title", content: "What Can I Cook? — Recipes From What You Have" },
      {
        property: "og:description",
        content:
          "Tell us what you have. We'll figure out dinner — instant recipe ideas from your ingredients.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STORAGE_KEY = "wcic:ingredients";
const TIME_OPTIONS = [10, 20, 30, 60];
const EMOJI = ["🍳", "🥘", "🍲", "🥗", "🍝"];

function timeLabel(m: number) {
  return m >= 60 ? "1 hour" : `${m} minutes`;
}

function Index() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [maxMinutes, setMaxMinutes] = useState(30);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);

  const run = useServerFn(findRecipes);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setIngredients(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    } catch {
      /* ignore */
    }
  }, [ingredients]);

  const addFromDraft = () => {
    const parts = draft
      .split(",")
      .map((p) => p.trim().toLowerCase())
      .filter(Boolean);
    if (!parts.length) return;
    setIngredients((prev) => Array.from(new Set([...prev, ...parts])));
    setDraft("");
  };

  const remove = (name: string) =>
    setIngredients((prev) => prev.filter((i) => i !== name));

  const search = async () => {
    const list = ingredients.length
      ? ingredients
      : draft
          .split(",")
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean);
    if (!list.length) {
      setError("Add at least one ingredient to get started.");
      return;
    }
    setIngredients(Array.from(new Set(list)));
    setDraft("");
    setError(null);
    setLoading(true);
    try {
      const res = await run({ data: { ingredients: list, maxMinutes } });
      setRecipes(res.recipes);
    } catch {
      setError("We couldn't fetch recipes just now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const heading = useMemo(
    () => (recipes ? `${recipes.length} ideas for tonight` : ""),
    [recipes],
  );

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Fresh eggs, tomatoes, onions, cheese and bread on a wooden table"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="relative mx-auto max-w-3xl px-5 pt-16 pb-10 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Recipe ideas from your kitchen
          </span>
          <h1 className="mt-6 text-4xl leading-[1.05] font-black tracking-tight text-foreground sm:text-6xl">
            What Can I Cook?
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-muted-foreground">
            Tell us what you have. We'll figure out dinner.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-4 max-w-3xl px-5">
        <div className="surface-card rounded-3xl border border-border p-5 shadow-lift sm:p-7">
          <label
            htmlFor="ingredients"
            className="text-sm font-semibold text-secondary-foreground"
          >
            Your ingredients
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <Input
              id="ingredients"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFromDraft();
                }
              }}
              placeholder="eggs, tomatoes, onions, cheese, bread"
              className="h-14 rounded-2xl border-border bg-card text-base shadow-soft"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addFromDraft}
              className="h-14 shrink-0 rounded-2xl px-5"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>

          {ingredients.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {ingredients.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => remove(item)}
                    className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm capitalize text-foreground transition-colors hover:border-primary hover:text-primary"
                    aria-label={`Remove ${item}`}
                  >
                    {item}
                    <X className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-sm font-semibold text-secondary-foreground">
            How much time do you have?
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMaxMinutes(m)}
                className={`rounded-2xl border px-3 py-3 text-sm font-medium transition-all ${
                  maxMinutes === m
                    ? "gradient-warm border-transparent text-primary-foreground shadow-soft"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {timeLabel(m)}
              </button>
            ))}
          </div>

          <Button
            onClick={search}
            disabled={loading}
            className="gradient-warm mt-6 h-14 w-full rounded-2xl text-base font-bold text-primary-foreground shadow-lift hover:opacity-95"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Cooking up ideas…
              </>
            ) : (
              <>🍳 Find Recipes</>
            )}
          </Button>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        {loading && !recipes && (
          <div className="grid gap-5 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-3xl border border-border bg-muted"
              />
            ))}
          </div>
        )}

        {recipes && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-foreground">{heading}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {recipes.map((r, i) => (
                <article
                  key={r.name + i}
                  className="surface-card flex flex-col overflow-hidden rounded-3xl border border-border shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className="gradient-warm flex h-28 items-center justify-center text-5xl">
                    <span aria-hidden>{EMOJI[i % EMOJI.length]}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-bold text-foreground">{r.name}</h3>
                    <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {r.minutes} min
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        {r.difficulty}
                      </span>
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">{r.description}</p>

                    <div className="mt-4 space-y-2 text-sm">
                      <p className="font-semibold text-secondary-foreground">Uses:</p>
                      <ul className="flex flex-wrap gap-x-3 gap-y-1">
                        {r.uses.map((u) => (
                          <li key={u} className="text-accent">
                            ✓ <span className="text-foreground capitalize">{u}</span>
                          </li>
                        ))}
                      </ul>
                      {r.missing.length > 0 && (
                        <>
                          <p className="pt-1 font-semibold text-secondary-foreground">
                            Missing:
                          </p>
                          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
                            {r.missing.map((m) => (
                              <li key={m} className="capitalize">
                                • {m}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => setSelected(r)}
                      className="mt-5 h-11 w-full rounded-xl font-semibold"
                    >
                      View Recipe
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!recipes && !loading && (
          <div className="mx-auto max-w-md text-center text-muted-foreground">
            <ChefHat className="mx-auto h-10 w-10 text-primary/60" />
            <p className="mt-3 text-sm">
              Add what's in your fridge and we'll suggest a handful of dinners you can
              actually make tonight.
            </p>
          </div>
        )}
      </section>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selected.name}</DialogTitle>
                <DialogDescription>
                  {selected.minutes} min · {selected.difficulty}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-secondary-foreground">
                  Ingredients
                </h4>
                <ul className="mt-2 divide-y divide-border rounded-2xl border border-border">
                  {selected.ingredients.map((ing) => (
                    <li
                      key={ing.item}
                      className="flex items-center justify-between px-4 py-2.5 text-sm"
                    >
                      <span className="capitalize text-foreground">{ing.item}</span>
                      <span className="text-muted-foreground">{ing.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-secondary-foreground">
                  Instructions
                </h4>
                <ol className="mt-2 space-y-3">
                  {selected.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm text-foreground">
                      <span className="gradient-warm flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
