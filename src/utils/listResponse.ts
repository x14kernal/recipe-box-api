import type { Response } from 'express';
import type { PaginationMeta } from '../types/api.js';
import type { ParsedListQuery, Recipe } from '../types/recipe.js';
import { sendSuccessWithMeta } from './apiResponse.js';
import { buildPaginationLinks } from './pagination.js';

export function sendRecipeListResponse(
  res: Response,
  data: { recipes: Recipe[]; total: number; page: number; limit: number; totalPages: number },
  query: ParsedListQuery,
  basePath: string,
) {
  const { page, limit, ingredientSlugs, tagSlugs, searchTerm, sortedBy, orderedBy } = query;

  const params = new URLSearchParams();

  if (searchTerm.length) params.set('search', searchTerm);
  if (ingredientSlugs && ingredientSlugs.length) params.set('ingredient', ingredientSlugs.join(','));
  if (tagSlugs && tagSlugs.length) params.set('tag', tagSlugs.join(','));
  if (sortedBy !== 'createdAt') params.set('sortBy', sortedBy);
  if (orderedBy !== 'desc') params.set('order', orderedBy);

  params.set('limit', String(limit));

  const { prev, next } = buildPaginationLinks(basePath, page, data.totalPages, params);

  const meta: PaginationMeta = { page, limit, total: data.total, prev, next };

  return sendSuccessWithMeta(res, data.recipes, meta);
}
