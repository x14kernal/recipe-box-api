import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

type Payload = {
  recipeId: string;
  tagIds: string[];
};
export async function createMany({ recipeId, tagIds }: Payload, client: DbClient = prisma) {
  return client.recipeTag.createMany({
    data: tagIds.map((id) => ({ recipe_id: recipeId, tag_id: id })),
  });
}

export async function replace({ recipeId, tagIds }: Payload, client: DbClient = prisma) {
  await client.recipeTag.deleteMany({ where: { recipe_id: recipeId } });
  return createMany({ recipeId, tagIds }, client);
}
