// Exercice : appler une API
// Cas concret d'utilisation de TS
// https://oclock-api.vercel.app/api/recipes

// Objectif :
// Afficher en console la liste des nom de recette accompagné du nombre d'ingrédient nécessaire
// - Cookies au beurre de cacahuète (7 ingrédient)
// - Macaron framboisier (5 ingrédients)

export const url = "https://oclock-api.vercel.app/api/recipes"; // Le "export" sert ici à dire qu'on est dans un MODULE, donc pouvoir utiliser le TOP-level await ('await' hors d'une fonction 'async')

const httpResponse = await fetch(url);
const recipes: Recipe[] = await httpResponse.json();

recipes.forEach(recipe => {
  console.log(`${recipe.title} (${recipe.ingredients.length} ingredients)`);
});

interface Recipe {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  author: string;
  difficulty: string;
  description: string;
  ingredients: Ingredient[];
}

interface Ingredient {
  id: number;
  quantity: number;
  unit: string;
  name: string;
}
