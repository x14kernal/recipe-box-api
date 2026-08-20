import { prisma } from '../lib/prisma.js';
import type { CreateRecipe, UpdateRecipe } from '../types/recipe.js';
import type { DbClient } from '../types/database.js';

export async function findById(id: string, client: DbClient = prisma) {
  return client.recipes.findUnique({
    where: {
      id,
    },
    include: {
      recipe_tags: {
        include: {
          tags: true,
        },
      },
    },
  });
}

type FindManyParams = {
  skip: number;
  take: number;
  ingredient?: string;
  tag?: string;
};
export async function findMany({
  skip,
  take,
  ingredient,
  tag,
}: FindManyParams) {
  const where = {
    ...(ingredient && {
      ingredients: {
        has: ingredient.toLowerCase(),
      },
    }),
    ...(tag && {
      recipe_tags: {
        some: {
          tags: {
            name: tag.toLowerCase(),
          },
        },
      },
    }),
  };

  const [recipes, total] = await Promise.all([
    prisma.recipes.findMany({
      where,
      skip,
      take,
      include: {
        recipe_tags: {
          include: {
            tags: true,
          },
        },
      },
    }),

    prisma.recipes.count({
      where,
    }),
  ]);

  return { recipes, total };
}

export async function findRandomId() {
  const result = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM recipes
    ORDER BY RANDOM()
    LIMIT 1
  `;

  return result[0] ?? null;
}

export async function deleteById(id: string) {
  return prisma.recipes.delete({
    where: {
      id,
    },
  });
}

type CreateParams = {
  recipe: CreateRecipe;
  userId: string;
};
export async function create(
  { recipe, userId }: CreateParams,
  client: DbClient = prisma
) {
  return client.recipes.create({
    data: {
      title: recipe.title.toLowerCase(),
      ingredients: recipe.ingredients.map((ing) => ing.toLowerCase()),
      steps: recipe.steps,
      user_id: userId,
    },
  });
}

type UpdateParams = {
  recipeId: string;
  recipe: UpdateRecipe;
};
export async function updateById(
  { recipe, recipeId }: UpdateParams,
  client: DbClient = prisma
) {
  return client.recipes.update({
    where: {
      id: recipeId,
    },
    data: {
      ...(recipe.title !== undefined && {
        title: recipe.title.toLowerCase(),
      }),

      ...(recipe.ingredients !== undefined && {
        ingredients: recipe.ingredients.map((ing) => ing.toLowerCase()),
      }),

      ...(recipe.steps !== undefined && {
        steps: recipe.steps,
      }),
    },
  });
}
