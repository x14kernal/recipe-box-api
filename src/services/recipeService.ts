import type { CreateRecipe, Recipe, UpdateRecipe } from '../types/recipe.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';
import { prisma } from '../lib/prisma.js';

import * as recipeRepo from '../repositories/recipeRepository.js';
import * as tagRepo from '../repositories/tagRepository.js';
import * as recipeTagRepo from '../repositories/recipeTagRepository.js';
import { ConflictError } from '../errors/ConflictError.js';

export async function getOne(id: string): Promise<Recipe> {
  const recipe = await recipeRepo.findById(id);
  if (!recipe) throw new NotFoundError('Recipe not found');
  return {
    id: recipe.id,
    ownerId: recipe.user_id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.recipe_tags.map((rt) => rt.tags.name),
  };
}

export async function getRandom() {
  const random = await recipeRepo.findRandomId();
  if (!random) throw new NotFoundError('No recipe found');
  return getOne(random.id);
}

export type GetManyParams = {
  page: number;
  limit: number;
  ingredient: string | undefined;
  tag: string | undefined;
};
export async function getMany({ page, limit, ingredient, tag }: GetManyParams) {
  const { recipes, total } = await recipeRepo.findMany({
    take: limit,
    skip: (page - 1) * limit,
    ...(ingredient && { ingredient }),
    ...(tag && { tag }),
  });

  if (total === 0) throw new NotFoundError('No match recipes');

  const transformedRecipes: Recipe[] = recipes.map((recipe) => ({
    id: recipe.id,
    ownerId: recipe.user_id,
    title: recipe.title,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    tags: recipe.recipe_tags.map((recipeTag) => recipeTag.tags.name),
  }));

  const totalPages = Math.ceil(total / limit);
  return {
    recipes: transformedRecipes,
    total,
    page,
    limit,
    totalPages,
  };
}

type CreateParams = {
  recipe: CreateRecipe;
  userId: string;
};
export async function createOne({
  recipe,
  userId,
}: CreateParams): Promise<Recipe> {
  return prisma.$transaction(async (tx) => {
    const tags = await tagRepo.create(recipe.tags, tx);
    const created = await recipeRepo.create({ recipe, userId }, tx);
    await recipeTagRepo.create(
      {
        recipeId: created.id,
        tagIds: tags.map((tag) => tag.id),
      },
      tx
    );

    return {
      id: created.id,
      ownerId: created.user_id,
      title: created.title,
      ingredients: created.ingredients,
      steps: created.steps,
      tags: tags.map((tag) => tag.name),
    };
  });
}

type UpdateParams = {
  recipeId: string;
  recipe: UpdateRecipe;
  userId: string;
};
export async function updateOne({ recipe, recipeId, userId }: UpdateParams) {
  return prisma.$transaction(async (tx) => {
    // 1. Check ownership
    const existing = await recipeRepo.findById(recipeId, tx);
    if (!existing) {
      throw new NotFoundError('Recipe not found');
    }

    if (existing.user_id !== userId) {
      throw new ForbiddenError('You cannot update this recipe');
    }

    // 2. Update recipe fields
    const updated = await recipeRepo.updateById({ recipeId, recipe }, tx);

    // 3. Update tags only if provided
    let tags = existing.recipe_tags.map((rt) => rt.tags);

    if (recipe.tags !== undefined) {
      tags = await tagRepo.create(recipe.tags, tx);

      await recipeTagRepo.replace(
        {
          recipeId,
          tagIds: tags.map((tag) => tag.id),
        },
        tx
      );
    }

    return {
      id: updated.id,
      ownerId: updated.user_id,
      title: updated.title,
      ingredients: updated.ingredients,
      steps: updated.steps,
      tags: tags.map((tag) => tag.name),
    };
  });
}

type DeleteParams = {
  recipeId: string;
  userId: string;
};
export async function deleteOne({ recipeId, userId }: DeleteParams) {
  const existing = await recipeRepo.findById(recipeId);

  if (!existing) {
    throw new NotFoundError('Recipe not found');
  }

  if (existing.user_id !== userId) {
    throw new ForbiddenError('You cannot delete this recipe');
  }

  try {
    await recipeRepo.deleteById(recipeId);
  } catch (error) {
    throw new ConflictError(
      'The recipe cannot be deleted because it is referenced by another resource.'
    );
  }
}
