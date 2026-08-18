import type { Request, Response } from 'express';
import * as recipeService from '../services/recipeService.js';

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
    req.baseUrl,
    page,
    data.totalPages,
    params
  );

  return res.json({
    data: data.recipes,
    page,
    limit,
    total: data.total,
    prev,
    next,
  });
}

export async function getById(req: Request<{ id: string }>, res: Response) {
  const recipe = await recipeService.getOne(req.params.id);
  return res.json(recipe);
}

export async function createRecipe(req: Request, res: Response) {
  const recipe = await recipeService.createOne({
    recipe: req.body,
    userId: req.userId,
  });

  return res.status(201).json({ success: true, data: recipe });
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

  return res.status(200).json({
    success: true,
    data: recipe,
  });
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
  return res.status(204).send();
}

export async function getRandomRecipe(req: Request, res: Response) {
  const recipe = await recipeService.getRandom();
  return res.json(recipe);
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
  baseUrl: string,
  page: number,
  totalPages: number,
  params: URLSearchParams
) {
  let next = null;
  let prev = null;

  if (page < totalPages) {
    const nextParams = new URLSearchParams(params);
    nextParams.set('page', String(page + 1));
    next = `${baseUrl}?${nextParams.toString()}`;
  }

  if (page > 1) {
    const prevParams = new URLSearchParams(params);
    prevParams.set('page', String(page - 1));
    prev = `${baseUrl}?${prevParams.toString()}`;
  }

  return { prev, next };
}
