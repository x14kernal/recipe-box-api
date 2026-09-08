import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

type Payload = {
  recipeId: string;
  ingredients: {
    id: string;
    quantity: number;
    unit: string;
  }[];
};

export async function createMany({ recipeId, ingredients }: Payload, client: DbClient = prisma) {
  return client.recipeIngredient.createManyAndReturn({
    data: ingredients.map(({ id, quantity, unit }) => ({
      recipe_id: recipeId,
      ingredient_id: id,
      quantity,
      unit,
    })),
  });
}

export async function replace({ recipeId, ingredients }: Payload, client: DbClient = prisma) {
  await client.recipeIngredient.deleteMany({
    where: {
      recipe_id: recipeId,
    },
  });

  return createMany({ recipeId, ingredients }, client);
}
