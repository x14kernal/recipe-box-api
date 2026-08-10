import type { Request, Response } from 'express';
import {
  type CreateRecipe,
  type Recipe,
  type UpdateRecipe,
} from '../types/recipe.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { loadRecipes, saveRecipes } from '../data/recipeStorage.js';

export function getAllRecipes(req: Request, res: Response) {
  let recipes = loadRecipes();

  const pageParam = Number(req.query.page);
  const limitParam = Number(req.query.limit);
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit =
    Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 30
      ? limitParam
      : 10;
  const ingredient = req.query.ingredient;
  const tag = req.query.tag;

  const params = new URLSearchParams();

  if (tag && typeof tag === 'string') {
    recipes = recipes.filter((r) =>
      r.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
    params.set('tag', String(tag));
  }

  if (ingredient && typeof ingredient === 'string') {
    recipes = recipes.filter((r) =>
      r.ingredients.some((i) => i.toLowerCase() === ingredient.toLowerCase())
    );
    params.set('ingredient', String(ingredient));
  }

  const total = recipes.length;
  const offset = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  params.set('limit', String(limit));

  let prevLink, nextLink;
  const nextParams = new URLSearchParams(params);
  const prevParams = new URLSearchParams(params);

  if (page < totalPages) {
    nextParams.set('page', `${page + 1}`);
    nextLink = `${req.baseUrl}?${nextParams.toString()}`;
  } else nextLink = null;

  if (page > 1) {
    prevParams.set('page', `${page - 1}`);
    prevLink = `${req.baseUrl}?${prevParams.toString()}`;
  } else prevLink = null;

  return res.json({
    data: recipes.slice(offset, offset + limit),
    page,
    limit,
    total,
    prev: prevLink,
    next: nextLink,
  });
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

export function getRandomRecipe(req: Request, res: Response) {
  const recipes = loadRecipes();
  if (recipes.length === 0) throw new NotFoundError('Recipe not found');
  const randomIndex = Math.floor(Math.random() * recipes.length);
  return res.json(recipes[randomIndex]);
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
