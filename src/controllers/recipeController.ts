import type { Request, Response } from 'express';
import { sendSuccessWithoutData, sendSuccess } from '../utils/apiResponse.js';
import { sendRecipeListResponse } from '../utils/listResponse.js';
import { parseRecipeQuery } from '../utils/recipeQuery.js';

import * as recipeService from '../services/recipeService.js';
import * as bookmarkService from '../services/bookmarkService.js';
import { listRecipesQuerySchema } from '../types/recipe.js';

export async function getAllRecipes(req: Request, res: Response) {
  const query = parseRecipeQuery(listRecipesQuerySchema.parse(req.query));
  const data = await recipeService.getMany(query);
  return sendRecipeListResponse(res, data, query, '/recipes');
}

export async function getMyRecipes(req: Request, res: Response) {
  const query = parseRecipeQuery(listRecipesQuerySchema.parse(req.query));
  const data = await recipeService.getMine(req.userId, query);
  return sendRecipeListResponse(res, data, query, '/recipes/mine');
}
export async function getMyRecipeById(req: Request<{ id: string }>, res: Response) {
  const recipe = await recipeService.getMyById(req.userId, req.params.id);
  return sendSuccess(res, recipe);
}

export async function getMyTrashedRecipes(req: Request, res: Response) {
  const query = parseRecipeQuery(listRecipesQuerySchema.parse(req.query));
  const data = await recipeService.getTrash(req.userId, query);
  return sendRecipeListResponse(res, data, query, '/recipes/trash');
}
export async function getTrashedById(req: Request<{ id: string }>, res: Response) {
  const recipe = await recipeService.getTrashedById(req.userId, req.params.id);
  return sendSuccess(res, recipe);
}

export async function getById(req: Request<{ id: string }>, res: Response) {
  const recipe = await recipeService.getOne(req.params.id);
  return sendSuccess(res, recipe);
}

export async function getRandomRecipe(_: Request, res: Response) {
  const recipe = await recipeService.getRandom();
  return sendSuccess(res, recipe);
}

export async function createRecipe(req: Request, res: Response) {
  const recipe = await recipeService.createOne({
    recipe: req.body,
    userId: req.userId,
  });
  return sendSuccess(res, recipe, 201);
}

export async function updateRecipe(req: Request<{ id: string }>, res: Response) {
  const recipe = await recipeService.updateOne({
    recipeId: req.params.id,
    recipe: req.body,
    userId: req.userId,
  });
  return sendSuccess(res, recipe);
}

export async function deleteRecipe(req: Request<{ id: string }>, res: Response) {
  await recipeService.deleteOne({
    recipeId: req.params.id,
    userId: req.userId,
  });
  return sendSuccessWithoutData(res);
}

export async function moveRecipeToTrash(req: Request<{ id: string }>, res: Response) {
  await recipeService.moveToTrash({ userId: req.userId, recipeId: req.params.id });
  return sendSuccessWithoutData(res);
}

export async function restoreRecipeFromTrash(req: Request<{ id: string }>, res: Response) {
  await recipeService.restoreFromTrash({
    recipeId: req.params.id,
    userId: req.userId,
  });
  return sendSuccessWithoutData(res);
}

export async function addToBookmarks(req: Request<{ id: string }>, res: Response) {
  await bookmarkService.addBookmark({ userId: req.userId, recipeId: req.params.id });
  return sendSuccessWithoutData(res);
}

export async function removeFromBookmarks(req: Request<{ id: string }>, res: Response) {
  await bookmarkService.deleteBookmark({ userId: req.userId, recipeId: req.params.id });
  return sendSuccessWithoutData(res);
}
