import type { Request, Response } from 'express';
import * as recipeService from '../services/recipeService.js';
import * as userService from '../services/userService.js';

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
  // maybe I'll create a middlerware to prevent creating new recipes if recipes = 100
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Create is disabled in production',
    });
  }

  // There's no real users yet! so I'll use fake users' ids
  const randomUserId = await userService.getRandomId();
  const recipe = await recipeService.createOne({
    recipe: req.body,
    userId: randomUserId,
  });

  return res.status(201).json({ success: true, data: recipe });
}

export async function updateRecipe(
  req: Request<{ id: string }>,
  res: Response
) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Update is disabled in production',
    });
  }

  const recipe = await recipeService.updateOne({
    recipeId: req.params.id,
    recipe: req.body,
    // just for now till build authentication
    userId: req.body.user_id,
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
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Delete is disabled in production',
    });
  }
  await recipeService.deleteOne(req.params.id);
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
