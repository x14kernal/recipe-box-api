import fs from 'node:fs';
import type { Recipe } from '../types/recipe.js';

const PATH = `${import.meta.dirname}/../../data/recipes.json`;

export function loadRecipes(): Recipe[] {
  return JSON.parse(fs.readFileSync(PATH, 'utf8'));
}
export function saveRecipes(recipes: Recipe[]) {
  fs.writeFileSync(PATH, JSON.stringify(recipes, null, 2));
}
