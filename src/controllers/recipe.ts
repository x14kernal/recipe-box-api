import type { Request, Response } from 'express';
import { recipes } from '../data/recipes.js';

export function getAllRecipes(req: Request, res: Response) {
  res.json(recipes);
}

export function getRecipeById(req: Request, res: Response) {
  const id = req.params.id;
  const recipe = recipes.find((recipe) => recipe.id === id);
  if (!recipe) {
    return res.status(404).json({ message: 'Recipe not found!' });
  }
  res.json(recipe);
}
