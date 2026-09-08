import { mapRecipe } from '../mappers/recipeMapper.js';
import * as bookmarkRepo from '../repositories/bookmarkRepository.js';
import type { ParsedListQuery } from '../types/recipe.js';

export async function getMany(userId: string, params: ParsedListQuery) {
  const { page, limit, ...query } = params;
  const sortedBy =
    query.sortedBy === 'createdAt' ? 'created_at' : query.sortedBy === 'servingSize' ? 'serving_size' : 'title';

  const { bookmarks, total } = await bookmarkRepo.findMany({
    userId,
    skip: (page - 1) * limit,
    take: limit,
    ...query,
    sortedBy,
  });

  console.log(userId, bookmarks);

  const totalPages = Math.ceil(total / limit);

  return {
    recipes: bookmarks.map((b) => mapRecipe(b.recipe)),
    total,
    page,
    limit,
    totalPages,
  };
}

type TUserRecipe = {
  userId: string;
  recipeId: string;
};
export async function addBookmark({ userId, recipeId }: TUserRecipe) {
  await bookmarkRepo.create({ userId, recipeId });
}

export async function deleteBookmark({ userId, recipeId }: TUserRecipe) {
  await bookmarkRepo.remove({ userId, recipeId });
}
