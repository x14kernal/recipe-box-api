import type { UserBookmarkWhereInput } from '../generated/prisma/models.js';
import { prisma } from '../lib/prisma.js';
import type { DbClient } from '../types/database.js';

type TFindMany = {
  userId: string;
  skip: number;
  take: number;
  orderedBy: 'asc' | 'desc';
  sortedBy: 'title' | 'serving_size' | 'created_at';
  searchTerm?: string;
  ingredientSlugs?: string[];
  tagSlugs?: string[];
};
export async function findMany(
  { userId, searchTerm, ingredientSlugs, tagSlugs, skip, take, sortedBy, orderedBy }: TFindMany,
  client: DbClient = prisma,
) {
  const where: UserBookmarkWhereInput = {
    user_id: userId,
    recipe: {
      deleted_at: null,
      visibility: 'public',
      ...(searchTerm && { title: { contains: searchTerm, mode: 'insensitive' } }),
      ...(ingredientSlugs?.length && {
        AND: ingredientSlugs.map((slug) => ({
          recipeIngredient: { some: { ingredient: { slug } } },
        })),
      }),
      ...(tagSlugs?.length && { OR: tagSlugs.map((slug) => ({ recipeTag: { some: { tag: { slug } } } })) }),
    },
  };

  const [bookmarks, total] = await Promise.all([
    client.userBookmark.findMany({
      where,
      skip,
      take,
      orderBy: { recipe: { [sortedBy]: orderedBy } },
      include: {
        recipe: {
          include: {
            recipeTag: { include: { tag: true } },
            recipeIngredient: { include: { ingredient: true } },
            recipeStep: { orderBy: { position: 'asc' } },
            recipeImage: true,
            user: true,
          },
        },
      },
    }),
    client.userBookmark.count({ where }),
  ]);

  return { bookmarks, total };
}

type TUserRecipe = {
  userId: string;
  recipeId: string;
};
export async function create({ userId, recipeId }: TUserRecipe, client: DbClient = prisma) {
  return client.userBookmark.create({ data: { recipe_id: recipeId, user_id: userId } });
}

export async function remove({ userId: user_id, recipeId: recipe_id }: TUserRecipe, client: DbClient = prisma) {
  return client.userBookmark.delete({
    where: { user_id_recipe_id: { user_id, recipe_id } },
  });
}
