import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';
import type { CreateRecipeImage, ExistingImg } from '../types/recipe.js';

export async function createMany(
  { recipeId, images }: CreateRecipeImage,
  client: DbClient = prisma,
) {
  return client.recipeImage.createManyAndReturn({
    data: images.map(({ imageUrl }) => ({
      recipe_id: recipeId,
      image_url: imageUrl,
    })),
  });
}

type TUpdate = {
  recipeId: string;
  images: ExistingImg[];
};
export async function updateMany({ recipeId, images }: TUpdate, client: DbClient = prisma) {
  return Promise.all(
    images.map(({ id, imageUrl }) =>
      client.recipeImage.update({
        where: { id, recipe_id: recipeId },
        data: { image_url: imageUrl },
      }),
    ),
  );
}

type TDelete = {
  recipeId: string;
  imageIds: string[];
};
export async function deleteMany({ recipeId, imageIds }: TDelete, client: DbClient = prisma) {
  return client.recipeImage.deleteMany({
    where: { id: { in: imageIds }, recipe_id: recipeId },
  });
}
