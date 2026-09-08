import type { Request } from 'express';
import { slugify } from './slugify.js';

export function parseRecipeQuery(query: Request['query']) {
  const pageParam = Number(query.page);
  const limitParam = Number(query.limit);
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isInteger(limitParam) && limitParam > 0 && limitParam <= 30 ? limitParam : 10;

  const ingredients = typeof query.ingredients === 'string' ? query.ingredients.split(',') : [];
  const ingredientSlugs = ingredients.map((i) => slugify(i));

  const tags = typeof query.tags === 'string' ? query.tags.split(',') : [];
  const tagSlugs = tags.map((t) => slugify(t));

  const searchTerm = typeof query.search === 'string' ? query.search : '';
  const orderedBy: 'desc' | 'asc' =
    typeof query.order === 'string' ? (query.order === 'desc' ? 'desc' : 'asc') : 'desc';
  const sortedBy: 'createdAt' | 'title' | 'servingSize' =
    typeof query.sortBy === 'string'
      ? query.sortBy === 'createdAt'
        ? 'createdAt'
        : query.sortBy === 'title'
          ? 'title'
          : 'servingSize'
      : 'createdAt';

  return { page, limit, ingredientSlugs, tagSlugs, searchTerm, orderedBy, sortedBy };
}
