import { slugify } from './slugify.js';
import type { ListRecipesQuery, ListRecipesQueryParsed } from '../types/recipe.js';

export function parseRecipeQuery(query: ListRecipesQuery): ListRecipesQueryParsed {
  const ingredients = parseQueryList(query.ingredients);
  const tags = parseQueryList(query.tags);

  return {
    page: query.page,
    limit: query.limit,
    searchTerm: query.search ?? '',
    orderedBy: query.order,
    sortedBy: query.sortBy,
    ...(ingredients.length && { ingredientSlugs: ingredients }),
    ...(tags.length && { tagSlugs: tags }),
  };
}

function parseQueryList(value?: string): string[] {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(slugify);
}
