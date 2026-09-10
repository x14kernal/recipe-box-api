import z from 'zod';
import { prisma } from '../lib/prisma.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import type { DbClient } from '../types/database.js';
import { ConflictError, NotFoundError } from '../errors/index.js';
import { mapRecipe, mapRecipeListItem } from '../mappers/recipeMapper.js';
import {
  idSchema,
  type CreateRecipe,
  type ExistingImg,
  type ExistingRecipeIngredient,
  type ExistingTag,
  type NewImg,
  type NewRecipeIngredient,
  type NewTag,
  type ListRecipesQueryParsed,
  type Recipe,
  type UpdateRecipe,
} from '../types/recipe.js';
import * as recipeRepo from '../repositories/recipeRepository.js';
import * as tagRepo from '../repositories/tagRepository.js';
import * as ingredientRepo from '../repositories/ingredientRepository.js';
import * as recipeStepRepo from '../repositories/recipeStepRepository.js';
import * as recipeImageRepo from '../repositories/recipeImageRepository.js';
import * as recipeIngredientRepo from '../repositories/recipeIngredientRepository.js';
import * as recipeTagRepo from '../repositories/recipeTagRepository.js';

export async function getOne(id: string): Promise<Recipe> {
  const recipeId = validateRecipeId(id);
  const recipe = await recipeRepo.findPublicById(recipeId);
  if (!recipe) throw new NotFoundError('Recipe not found');
  return mapRecipe(recipe);
}

export async function getRandom() {
  const random = await recipeRepo.findRandomId();
  if (!random) throw new NotFoundError('No recipe found');
  return getOne(random.id);
}

export async function getMyById(userId: string, id: string): Promise<Recipe> {
  const recipeId = validateRecipeId(id);
  const recipe = await getOwnedRecipeOrThrow({ recipeId, userId });
  return mapRecipe(recipe);
}

export async function getTrashedById(userId: string, id: string): Promise<Recipe> {
  const recipeId = validateRecipeId(id);
  const recipe = await getOwnedRecipeOrThrow({ recipeId, userId, isTrash: true });
  return mapRecipe(recipe);
}

export async function getMany(params: ListRecipesQueryParsed) {
  return getManyInternal(params);
}

export async function getMine(userId: string, params: ListRecipesQueryParsed) {
  return getManyInternal({
    ...params,
    userId,
  });
}

export async function getTrash(userId: string, params: ListRecipesQueryParsed) {
  return getManyInternal({
    ...params,
    userId,
    isTrash: true,
  });
}

type TCreate = {
  recipe: CreateRecipe;
  userId: string;
};
export async function createOne({ recipe, userId }: TCreate): Promise<Recipe> {
  return prisma.$transaction(async (tx) => {
    // Recipe
    const created = await recipeRepo.create({ recipe, userId }, tx);
    const recipeId = created.id;

    // Tags
    const tagsToCreate = recipe.tags.filter((tag): tag is NewTag => !('id' in tag));
    const tagsToSync = recipe.tags.filter((tag): tag is ExistingTag => 'id' in tag);
    // Create missing tags
    const createdTags = await tagRepo.createMany(tagsToCreate, tx);
    // Add new created tags to tagsToSync list
    tagsToCreate.forEach(({ name }) => {
      const item = createdTags.get(name.trim().toLowerCase());
      if (!item) throw new NotFoundError('Tag not found');
      tagsToSync.push({ id: item.id });
    });

    // Sync recipe tags
    await recipeTagRepo.createMany({ recipeId, tagIds: tagsToSync.map((item) => item.id) }, tx);

    // Ingredients
    const ingsToCreate = recipe.ingredients.filter((ing): ing is NewRecipeIngredient => !('id' in ing));
    const ingsToSync = recipe.ingredients.filter((ing): ing is ExistingRecipeIngredient => 'id' in ing);

    // Create missing ingredinets
    const createdIngs = await ingredientRepo.createMany(
      ingsToCreate.map((i) => ({ image: i.image, name: i.name })),
      tx,
    );

    // Add new created ings to ingsToSync list
    ingsToCreate.forEach(({ name, quantity, unit }) => {
      const item = createdIngs.get(name.trim().toLowerCase());
      if (!item) throw new NotFoundError('Ingredient not found');
      ingsToSync.push({ id: item.id, quantity, unit });
    });

    // Sync recipe ingredients
    await recipeIngredientRepo.createMany({ recipeId, ingredients: ingsToSync }, tx);

    // one recipe -> many steps,images
    await recipeStepRepo.createMany({ recipeId, steps: recipe.steps }, tx);
    await recipeImageRepo.createMany({ recipeId, images: recipe.images }, tx);

    const fullRecipe = await getOwnedRecipeOrThrow({ recipeId, userId }, tx);
    return mapRecipe(fullRecipe);
  });
}

type TUpdate = {
  recipeId: string;
  recipe: UpdateRecipe;
  userId: string;
};
export async function updateOne({ recipe, recipeId, userId }: TUpdate) {
  return prisma.$transaction(async (tx) => {
    const existing = await getOwnedRecipeOrThrow({ recipeId, userId }, tx);

    // Ingredients exist -> update | Else keep them as-are
    if (recipe.ingredients) {
      const ingsToCreate = recipe.ingredients.filter((ing): ing is NewRecipeIngredient => !('id' in ing));
      const ingsToSync = recipe.ingredients.filter((ing): ing is ExistingRecipeIngredient => 'id' in ing);

      // Create missing ingredinets
      const createdIngs = await ingredientRepo.createMany(
        ingsToCreate.map((i) => ({ image: i.image, name: i.name })),
        tx,
      );

      // Add new created ings to ingsToSync list
      ingsToCreate.forEach(({ name, quantity, unit }) => {
        const item = createdIngs.get(name);
        if (!item) throw new NotFoundError('Ingredient not found.');
        ingsToSync.push({ id: item.id, quantity, unit });
      });

      // Sync recipe ingredients (it will delete all recipeIngredients based on recipeId, then creat new ones using createMany)
      await recipeIngredientRepo.replace({ recipeId, ingredients: ingsToSync }, tx);
    }

    // Tags exist -> update | Else keep them as-are
    if (recipe.tags) {
      const tagsToCreate = recipe.tags.filter((tag): tag is NewTag => !('id' in tag));
      const tagsToSync = recipe.tags.filter((tag): tag is ExistingTag => 'id' in tag);

      // Create missing tags
      const createdTags = await tagRepo.createMany(tagsToCreate, tx);

      // Add new created tags to tagsToSync list
      tagsToCreate.forEach(({ name }) => {
        const item = createdTags.get(name);
        if (!item) throw new NotFoundError('Tag not found.');
        tagsToSync.push({ id: item.id });
      });

      // Sync recipe tags (it will delete all recipeTags based on recipeId, then creat new ones using createMany)
      await recipeTagRepo.replace({ recipeId, tagIds: tagsToSync.map((item) => item.id) }, tx);
    }

    // Sync steps
    if (recipe.steps) await recipeStepRepo.replace({ recipeId, steps: recipe.steps }, tx);

    // Sync images
    if (recipe.images) {
      const existingImgIds = existing.recipeImage.map((i) => i.id);

      // To Create
      const imgsToCreate = recipe.images.filter((image): image is NewImg => !('id' in image));

      // To Update
      const imgsToUpdate = new Map(
        recipe.images.filter((image): image is ExistingImg => !!image.id).map((image) => [image.id, image]),
      );

      // To Delete -> Existing in existingImgIds but not in imgsToUpdate
      const imgsToDelete = existingImgIds.filter((id) => !imgsToUpdate.has(id));

      await recipeImageRepo.createMany({ recipeId, images: imgsToCreate }, tx);
      await recipeImageRepo.updateMany({ recipeId, images: [...imgsToUpdate.values()] }, tx);
      await recipeImageRepo.deleteMany({ recipeId, imageIds: imgsToDelete }, tx);
    }

    // Update recipe fields
    await recipeRepo.updateById({ recipeId, recipe }, tx);

    const fullRecipe = await getOwnedRecipeOrThrow({ recipeId, userId }, tx);
    return mapRecipe(fullRecipe);
  });
}

type TOwnedRecipe = {
  recipeId: string;
  userId: string;
};

export async function deleteOne({ recipeId, userId }: TOwnedRecipe) {
  return prisma.$transaction(async (tx) => {
    await getOwnedRecipeOrThrow({ recipeId, userId }, tx);

    try {
      await recipeRepo.deleteById(recipeId, tx);
    } catch (error) {
      if (!(error instanceof PrismaClientKnownRequestError)) throw error;
      if (error.code === 'P2003')
        throw new ConflictError('The recipe cannot be deleted because it is referenced by another resource.');
    }
  });
}

export async function moveToTrash({ recipeId, userId }: TOwnedRecipe) {
  // Check if exists and right owner, If not will throw `Not Found Recip` error
  await getOwnedRecipeOrThrow({ recipeId, userId });
  await recipeRepo.updateFields({ data: { deleted_at: new Date() }, recipeId });
}

export async function restoreFromTrash({ recipeId, userId }: TOwnedRecipe) {
  // Check if exists and right owner, If not will throw `Not Found Recip` error
  await getOwnedRecipeOrThrow({ recipeId, userId, isTrash: true });
  await recipeRepo.updateFields({ data: { deleted_at: null }, recipeId });
}

type TGetOwnedRecipeOrThrow = {
  recipeId: string;
  userId: string;
  isTrash?: boolean;
};
async function getOwnedRecipeOrThrow({ recipeId, userId, isTrash }: TGetOwnedRecipeOrThrow, tx?: DbClient) {
  const existing = await recipeRepo.findWhere(
    {
      id: recipeId,
      userId,
      ...(isTrash && { isTrash: true }),
    },
    tx,
  );
  if (!existing) throw new NotFoundError('Recipe not found');
  return existing;
}

type TGetManyInternal = ListRecipesQueryParsed & {
  userId?: string;
  isTrash?: boolean;
};
async function getManyInternal({
  ingredientSlugs = [],
  tagSlugs = [],
  searchTerm,
  orderedBy,
  sortedBy,
  isTrash,
  userId,
  limit,
  page,
}: TGetManyInternal) {
  const sortedByCast = sortedBy === 'createdAt' ? 'created_at' : sortedBy === 'servingSize' ? 'serving_size' : 'title';

  const { recipes, total } = await recipeRepo.findMany({
    take: limit,
    skip: (page - 1) * limit,
    sortedBy: sortedByCast,
    orderedBy,
    ...(userId && { userId }),
    ...(isTrash && { isTrash }),
    ...(ingredientSlugs.length && { ingredientSlugs }),
    ...(tagSlugs.length && { tagSlugs }),
    ...(searchTerm.length && { searchTerm }),
  });

  if (total === 0)
    return {
      recipes: [],
      total,
      page,
      limit,
      totalPages: 0,
    };

  const totalPages = Math.ceil(total / limit);

  return {
    recipes: recipes.map((recipe) => mapRecipeListItem(recipe)),
    total,
    page,
    limit,
    totalPages,
  };
}

function validateRecipeId(id: string) {
  const result = z.safeParse(idSchema, id);
  if (!result.success) throw new NotFoundError('Recipe not found');
  return result.data;
}
