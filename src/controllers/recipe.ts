import type { Request, Response } from 'express';
import {
  type CreateRecipe,
  type Recipe,
  type UpdateRecipe,
} from '../types/recipe.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { loadRecipes, saveRecipes } from '../data/recipeStorage.js';

export function getAllRecipes(req: Request, res: Response) {
  const recipes = loadRecipes();
  const tag = req.query.tag;
  if (tag && typeof tag === 'string') {
    return res.json(recipes.filter((r) => r.tags.includes(tag)));
  }
  return res.json(recipes);
}

export function getRecipeById(req: Request, res: Response) {
  const recipes = loadRecipes();
  const recipe = recipes.find((recipe) => recipe.id === req.params.id);
  if (!recipe) throw new NotFoundError('Recipe not found');
  return res.json(recipe);
}

export function createRecipe(req: Request, res: Response) {
  const recipe = createNewRecipe(req.body);
  const recipes = loadRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
  return res.status(201).json({ success: true, data: recipe });
}

export function updateRecipe(req: Request<{ id: string }>, res: Response) {
  const recipes = loadRecipes();
  const recipeIndex = recipes.findIndex((r) => r.id === req.params.id);
  if (recipeIndex === -1) throw new NotFoundError('Recipe not found');
  return res.status(200).json({
    success: true,
    data: updateExistRecipe(recipes, recipeIndex, req.body),
  });
}

export function deleteRecipe(req: Request<{ id: string }>, res: Response) {
  const recipes = loadRecipes();
  const recipeIndex = recipes.findIndex((r) => r.id === req.params.id);
  if (recipeIndex === -1) throw new NotFoundError('Recipe not found');
  removeRecipe(recipes, recipeIndex);
  return res.status(204).send();
}

function createNewRecipe(data: CreateRecipe): Recipe {
  const recipe = { id: `${Date.now()}`, ...data };
  return recipe;
}

function updateExistRecipe(
  recipes: Recipe[],
  recipeIndex: number,
  updatedFields: UpdateRecipe
): Recipe {
  recipes[recipeIndex] = {
    ...recipes[recipeIndex],
    ...updatedFields,
  } as Recipe;

  saveRecipes(recipes);
  return recipes[recipeIndex];
}

function removeRecipe(recipes: Recipe[], recipeIndex: number) {
  recipes.splice(recipeIndex, 1);
  saveRecipes(recipes);
}
