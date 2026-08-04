import type { Request, Response } from 'express';
import { recipes } from '../data/recipes.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
  type CreateRecipe,
  type Recipe,
  type UpdateRecipe,
} from '../types/recipe.js';

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

export function createRecipe(req: Request, res: Response) {
  const validated = createRecipeSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validated.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const recipe = createNewRecipe(validated.data);
  persistRecipe(recipe);
  res.status(201).json({ success: true, data: recipe });
}

export function updateRecipe(req: Request<{ id: string }>, res: Response) {
  const validated = updateRecipeSchema.safeParse(req.body);

  if (!validated.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validated.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const recipeIndex = recipes.findIndex((r) => r.id === req.params.id);
  if (recipeIndex === -1)
    return res.status(404).json({
      success: false,
      message: 'Recipe not found',
    });

  res.status(200).json({
    success: true,
    data: updateExistRecipe(recipeIndex, validated.data),
  });
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
