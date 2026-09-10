import type { RecipeGetPayload } from '../generated/prisma/models.js';
import type { Recipe, RecipeListItem } from '../types/recipe.js';

type DbRecipe = RecipeGetPayload<{
  include: {
    recipeIngredient: { include: { ingredient: true } };
    recipeStep: { orderBy: { position: 'asc' } };
    recipeTag: { include: { tag: true } };
    recipeImage: true;
    user: true;
  };
}>;

type DbRecipeListItem = RecipeGetPayload<{
  select: {
    id: true;
    title: true;
    serving_size: true;
    visibility: true;
    created_at: true;

    user: { select: { id: true; username: true; display_name: true } };
    recipeTag: { select: { tag: { select: { id: true; name: true; slug: true } } } };
    recipeImage: { select: { id: true; image_url: true } };
  };
}>;

export function mapRecipe(recipe: DbRecipe): Recipe {
  return {
    id: recipe.id,
    ownerId: recipe.user_id,
    title: recipe.title,
    servingSize: recipe.serving_size,
    visibility: recipe.visibility,
    createdAt: recipe.created_at.toISOString(),
    updatedAt: recipe.updated_at.toISOString(),
    user: {
      id: recipe.user.id,
      username: recipe.user.username,
      displayName: recipe.user.display_name,
    },

    images: recipe.recipeImage.map(({ id, image_url }) => ({ id, imageUrl: image_url })),

    ingredients: recipe.recipeIngredient.map((item) => ({
      id: item.ingredient.id,
      slug: item.ingredient.slug,
      name: item.ingredient.name,
      quantity: Number(item.quantity),
      unit: item.unit,
      image: item.ingredient.image_url,
    })),

    steps: recipe.recipeStep.map((item) => ({
      id: item.id,
      position: item.position,
      description: item.description,
      image: item.image_url,
    })),

    tags: recipe.recipeTag.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
  };
}

export function mapRecipeListItem(recipe: DbRecipeListItem): RecipeListItem {
  return {
    id: recipe.id,
    ownerId: recipe.user.id,
    title: recipe.title,
    servingSize: recipe.serving_size,
    visibility: recipe.visibility,
    createdAt: recipe.created_at.toISOString(),

    user: {
      id: recipe.user.id,
      username: recipe.user.username,
      displayName: recipe.user.display_name,
    },

    coverImage: recipe.recipeImage[0]
      ? {
          id: recipe.recipeImage[0].id,
          imageUrl: recipe.recipeImage[0].image_url,
        }
      : null,

    tags: recipe.recipeTag.map(({ tag }) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
  };
}
