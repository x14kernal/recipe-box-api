import type { Request, Response } from 'express';
import { recipes } from '../data/recipes.js';
import {
  type CreateRecipe,
  type Recipe,
  type UpdateRecipe,
} from '../types/recipe.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export function getAllRecipes(req: Request, res: Response) {
  const tag = req.query.tag;
  if (tag && typeof tag === 'string') {
    return res.json(recipes.filter((r) => r.tags.includes(tag)));
  }
  return res.json(recipes);
}

export function getRecipeById(req: Request, res: Response) {
  const recipe = recipes.find((recipe) => recipe.id === req.params.id);
  if (!recipe) throw new NotFoundError('Recipe not found');
  return res.json(recipe);
}

export function createRecipe(req: Request, res: Response) {
  const recipe = createNewRecipe(req.body);
  persistRecipe(recipe);
  return res.status(201).json({ success: true, data: recipe });
}

export function updateRecipe(req: Request<{ id: string }>, res: Response) {
  const recipeIndex = recipes.findIndex((r) => r.id === req.params.id);
  if (recipeIndex === -1) throw new NotFoundError('Recipe not found');
  return res.status(200).json({
    success: true,
    data: updateExistRecipe(recipeIndex, req.body),
  });
}

export function deleteRecipe(req: Request<{ id: string }>, res: Response) {
  const recipeIndex = recipes.findIndex((r) => r.id === req.params.id);
  if (recipeIndex === -1) throw new NotFoundError('Recipe not found');
  removeRecipe(recipeIndex);
  return res.status(204).send();
}

function createNewRecipe(data: CreateRecipe): Recipe {
  const recipe = { id: `${Date.now()}`, ...data };
  return recipe;
}

function updateExistRecipe(
  recipeIndex: number,
  updatedFields: UpdateRecipe
): Recipe {
  recipes[recipeIndex] = {
    ...recipes[recipeIndex],
    ...updatedFields,
  } as Recipe;
  return recipes[recipeIndex];
}

function persistRecipe(recipe: Recipe) {
  recipes.push(recipe);
}

function removeRecipe(recipeIndex: number) {
  recipes.splice(recipeIndex, 1);
}
