import { prisma } from '../lib/prisma.js';
import type { CreateRecipe, UpdateRecipe } from '../types/recipe.js';
import type { DbClient } from '../types/database.js';
import type { RecipeUpdateInput, RecipeWhereInput } from '../generated/prisma/models.js';

type TFindWhere = {
  id: string;
  userId?: string;
  isTrash?: boolean;
};
export async function findWhere({ id, userId, isTrash }: TFindWhere, client: DbClient = prisma) {
  const where = {
    id,
    deleted_at: isTrash === undefined ? null : isTrash ? { not: null } : null,
    ...(userId && { user_id: userId }),
  };

  return client.recipe.findFirst({
    where,
    include: {
      recipeIngredient: { include: { ingredient: true } },
      recipeStep: { orderBy: { position: 'asc' } },
      recipeTag: { include: { tag: true } },
      recipeImage: true,
      user: true,
    },
  });
}

export async function findPublicById(id: string, client: DbClient = prisma) {
  return client.recipe.findFirst({
    where: { id, deleted_at: null, visibility: 'public' },
    include: {
      recipeIngredient: { include: { ingredient: true } },
      recipeStep: { orderBy: { position: 'asc' } },
      recipeTag: { include: { tag: true } },
      recipeImage: true,
      user: true,
    },
  });
}

export async function findByIdOrThrow(id: string, client: DbClient = prisma) {
  return client.recipe.findUniqueOrThrow({
    where: { id },
    include: {
      recipeIngredient: { include: { ingredient: true } },
      recipeStep: { orderBy: { position: 'asc' } },
      recipeTag: { include: { tag: true } },
      recipeImage: true,
    },
  });
}

export async function findRandomId() {
  const result = await prisma.$queryRaw<{ id: string }[]>`
    SELECT id
    FROM recipes
    WHERE visibility = 'public'
    ORDER BY RANDOM()
    LIMIT 1
  `;

  return result[0] ?? null;
}

export async function deleteById(id: string, client: DbClient = prisma) {
  return client.recipe.delete({ where: { id } });
}

type TFindMany = {
  skip: number;
  take: number;
  orderedBy: 'asc' | 'desc';
  sortedBy: 'title' | 'serving_size' | 'created_at';
  searchTerm?: string;
  ingredientSlugs?: string[];
  tagSlugs?: string[];
  userId?: string;
  isTrash?: boolean;
};
export async function findMany(
  { ingredientSlugs, searchTerm, orderedBy, sortedBy, tagSlugs, isTrash, userId, take, skip }: TFindMany,
  client: DbClient = prisma,
) {
  const where: RecipeWhereInput = {
    ...(!userId && !isTrash && { visibility: 'public' }),

    deleted_at: isTrash === undefined ? null : isTrash ? { not: null } : null,

    // If userId exists -> Get ONLY user's recipes
    ...(userId && { user_id: userId }),

    // If searchTerm exists
    ...(searchTerm && { title: { contains: searchTerm, mode: 'insensitive' } }),

    // If ingredientSlugs exists
    ...(ingredientSlugs?.length && {
      AND: ingredientSlugs.map((slug) => ({
        recipeIngredient: { some: { ingredient: { slug } } },
      })),
    }),

    // If tagSlugs exists
    ...(tagSlugs?.length && { OR: tagSlugs.map((slug) => ({ recipeTag: { some: { tag: { slug } } } })) }),
  };

  const [recipes, total] = await Promise.all([
    client.recipe.findMany({
      where,
      skip,
      take,
      orderBy: {
        [sortedBy]: orderedBy, // defualt createdAt -> desc
      },
      select: {
        id: true,
        title: true,
        serving_size: true,
        visibility: true,
        created_at: true,
        user: { select: { id: true, username: true, display_name: true } },
        recipeTag: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        recipeImage: { select: { id: true, image_url: true } },
      },
    }),

    client.recipe.count({ where }),
  ]);

  return { recipes, total };
}

type TCreate = {
  recipe: CreateRecipe;
  userId: string;
};
export async function create({ recipe, userId }: TCreate, client: DbClient = prisma) {
  return client.recipe.create({
    data: {
      title: recipe.title.toLowerCase(),
      user_id: userId,
      serving_size: recipe.servingSize,
      visibility: recipe.visibility,
    },
  });
}

type TUpdate = {
  recipeId: string;
  recipe: UpdateRecipe;
};
export async function updateById({ recipe, recipeId }: TUpdate, client: DbClient = prisma) {
  const data = {
    ...(recipe.title !== undefined && { title: recipe.title.toLowerCase() }),
    ...(recipe.servingSize !== undefined && { serving_size: recipe.servingSize }),
    ...(recipe.visibility !== undefined && { visibility: recipe.visibility }),
  };

  return updateFields({ data, recipeId }, client);
}

type TUpdateFields = {
  recipeId: string;
  data: RecipeUpdateInput;
};
export async function updateFields({ data, recipeId: id }: TUpdateFields, client: DbClient = prisma) {
  return client.recipe.update({ where: { id }, data });
}
