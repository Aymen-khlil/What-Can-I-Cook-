# Kitchen Genie

Build a beautiful one-page web app called "What Can I Cook?"

The purpose is to help people decide what to cook using ingredients they already have.

Main page

Header:

What Can I Cook?

Subtitle:
"Tell us what you have. We'll figure out dinner."

Create a large ingredient input where users can type:

"eggs, tomatoes, onions, cheese, bread"

Add a prominent button:

🍳 Find Recipes

Also provide quick options for available cooking time:

10 minutes

20 minutes

30 minutes

1 hour

Results

Display 3–5 recipe cards.

Each card should contain:

Recipe name

Image or attractive food illustration

Cooking time

Difficulty

Ingredients used

Missing ingredients, if any

Short description

Example:

Tomato Omelette
20 min · Easy

Uses:
✓ Eggs
✓ Tomatoes
✓ Onion

Missing:

Parsley

Add a button:
View Recipe

Recipe detail

When a recipe is selected, show a simple detail panel or modal containing:

Ingredients

Quantities

Step-by-step instructions

Cooking time

AI

Use AI to generate recipe suggestions based on the ingredients entered by the user.

If no AI API is available, create mock recipe data so the application remains functional.

UX

Allow users to remove ingredients and add new ones.

Remember their ingredients using localStorage.

No authentication, database, payment system, or unnecessary pages.

Make the interface visually appealing, warm, modern, and highly responsive.

Focus on making the experience extremely simple: enter ingredients → get ideas.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://simple-supper-ideas.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5daec091-e6d1-451e-afa8-82d59388aae7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
