import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';
import type { CreateRecipeStep } from '../types/recipe.js';

export async function createMany({ recipeId, steps }: CreateRecipeStep, client: DbClient = prisma) {
  return client.recipeStep.createManyAndReturn({
    data: steps.map((s, i) => ({
      recipe_id: recipeId,
      image_url: s.image ?? null,
      description: s.description,
      position: i + 1,
    })),
  });
}

type TDelete = {
  recipeId: string;
  stepIds: string[];
};
export async function deleteMany({ recipeId, stepIds }: TDelete, client: DbClient = prisma) {
  return client.recipeStep.deleteMany({
    where: { id: { in: stepIds }, recipe_id: recipeId },
  });
}

export async function replace({ recipeId, steps }: CreateRecipeStep, client: DbClient = prisma) {
  await client.recipeStep.deleteMany({ where: { recipe_id: recipeId } });
  return createMany({ recipeId, steps }, client);
}
