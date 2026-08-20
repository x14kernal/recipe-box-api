import type { Request, Response } from 'express';
import * as recipeService from '../services/recipeService.js';
import {
  sendNoContent,
  sendSuccess,
  sendSuccessWithMeta,
} from '../utils/apiResponse.js';
import type { PaginationMeta } from '../types/api.js';

export async function getAllRecipes(req: Request, res: Response) {
  const { page, limit, ingredient, tag } = parseRecipeQuery(req.query);
  const data = await recipeService.getMany({
    page,
    limit,
    ingredient,
    tag,
  });

  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (ingredient) params.set('ingredient', ingredient);
  params.set('limit', String(limit));

  const { prev, next } = buildPaginationLinks(
    '/recipes',
    page,
    data.totalPages,
    params
  );

  const meta: PaginationMeta = {
    page,
    limit,
    total: data.total,
    prev,
    next,
  };

  return sendSuccessWithMeta(res, data.recipes, meta);
}

export async function getById(req: Request<{ id: string }>, res: Response) {
  const recipe = await recipeService.getOne(req.params.id);
  return sendSuccess(res, recipe);
}

export async function createRecipe(req: Request, res: Response) {
  const recipe = await recipeService.createOne({
    recipe: req.body,
    userId: req.userId,
  });
  return sendSuccess(res, recipe, 201);
}

export async function updateRecipe(
  req: Request<{ id: string }>,
  res: Response
) {
  const recipe = await recipeService.updateOne({
    recipeId: req.params.id,
    recipe: req.body,
    userId: req.userId,
  });
  return sendSuccess(res, recipe);
}

export async function deleteRecipe(
  req: Request<{ id: string }>,
  res: Response
) {
  // TODO
  // It doesnot work correctlly: "Foreign key constraint violated on the constraint"
  await recipeService.deleteOne({
    recipeId: req.params.id,
    userId: req.userId,
  });
  return sendNoContent(res);
}

export async function getRandomRecipe(req: Request, res: Response) {
  const recipe = await recipeService.getRandom();
  return sendSuccess(res, recipe);
}

function parseRecipeQuery(query: Request['query']) {
  const pageParam = Number(query.page);
  const limitParam = Number(query.limit);

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const limit =
    Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 30
      ? limitParam
      : 10;

  const ingredient =
    typeof query.ingredient === 'string' ? query.ingredient : undefined;

  const tag = typeof query.tag === 'string' ? query.tag : undefined;

  return {
    page,
    limit,
    ingredient,
    tag,
  };
}

function buildPaginationLinks(
  path: string,
  page: number,
  totalPages: number,
  params: URLSearchParams
) {
  let next = null;
  let prev = null;

  if (page < totalPages) {
    const nextParams = new URLSearchParams(params);
    nextParams.set('page', String(page + 1));
    next = `${path}?${nextParams.toString()}`;
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(params);
    prevParams.set('page', String(page - 1));
    prev = `${path}?${prevParams.toString()}`;
  }

  return { prev, next };
}
