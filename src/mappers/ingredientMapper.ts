import type { Ingredient as DbIngredient } from '../generated/prisma/client.js';
import type { Ingredient } from '../types/recipe.js';

export function mapIngredeint(ingredient: DbIngredient): Ingredient {
  return {
    id: ingredient.id,
    name: ingredient.name,
    slug: ingredient.slug,
    image_url: ingredient.image_url,
  };
}
