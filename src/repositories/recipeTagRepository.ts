import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

type Payload = {
  recipeId: string;
  tagIds: string[];
};
export async function create(
  { recipeId, tagIds }: Payload,
  client: DbClient = prisma
) {
  return client.recipe_tags.createMany({
    data: tagIds.map((id) => ({ recipe_id: recipeId, tag_id: id })),
  });
}

export async function replace(
  { recipeId, tagIds }: Payload,
  client: DbClient = prisma
) {
  await client.recipe_tags.deleteMany({
    where: {
      recipe_id: recipeId,
    },
  });

  return create({ recipeId, tagIds }, client);
}
