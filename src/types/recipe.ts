import z from 'zod';
import { userSchema } from './user.js';

export const idSchema = z.uuid();

// ---------------------------------------------------------------------------
// Ingredient — shared dictionary
// ---------------------------------------------------------------------------

const ingredientBaseSchema = z.object({
  name: z.string().trim().toLowerCase().min(2).max(80),
  image: z.string().trim().url().nullish(),
});

const recipeIngredientAmountSchema = z.object({
  quantity: z.coerce.number().positive(),
  unit: z.string().trim().toLowerCase().min(1).max(20),
});

/** The ingredient doesn't exist in the dictionary yet — create it and link it in one step. */
const newRecipeIngredientSchema = ingredientBaseSchema.extend(recipeIngredientAmountSchema.shape);

/** Links to an existing dictionary Ingredient by id. */
const existingRecipeIngredientSchema = z.object({ id: idSchema }).extend(recipeIngredientAmountSchema.shape);

/** `id` present -> link an existing Ingredient. `id` absent -> create a new one and link it */
const recipeIngredientInputSchema = z.union([existingRecipeIngredientSchema, newRecipeIngredientSchema]);

// ---------------------------------------------------------------------------
// Tag — shared dictionary
// ---------------------------------------------------------------------------

const existingTagSchema = z.object({ id: idSchema });
const newTagSchema = z.object({ name: z.string().trim().toLowerCase().min(3).max(30) });

/** Same existing-vs-new pattern as ingredients. */
const recipeTagSchema = z.union([existingTagSchema, newTagSchema]);

// ---------------------------------------------------------------------------
// Step
// ---------------------------------------------------------------------------

const newStepSchema = z.object({
  description: z.string().trim().min(1).max(2000),
  image: z.string().trim().url().nullish(),
});

const existingStepSchema = newStepSchema.extend({
  id: idSchema,
  position: z.int().nonnegative().min(1),
});

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------

const newImgSchema = z.object({ imageUrl: z.url() });
const existingImgSchema = newImgSchema.extend({ id: idSchema });

// ---------------------------------------------------------------------------
// Recipe
// ---------------------------------------------------------------------------

const recipeBaseSchema = z.object({
  title: z.string().trim().min(4).max(200),
  servingSize: z.coerce.number().int().min(1).max(1000),
  visibility: z.enum(['public', 'private']),
  ingredients: z.array(recipeIngredientInputSchema).min(1).max(50),
  images: z.array(newImgSchema).min(1).max(10),
  tags: z.array(recipeTagSchema).min(1).max(10),
  steps: z.array(newStepSchema).min(1).max(50),
});

export const createRecipeSchema = recipeBaseSchema;

// ---------------------------------------------------------------------------
// Recipe: Update
// ---------------------------------------------------------------------------

export const updateRecipeSchema = z.object({
  title: z.string().trim().min(4).max(200).optional(),
  servingSize: z.coerce.number().int().min(1).max(1000).optional(),
  visibility: z.enum(['public', 'private']).optional(),

  images: z
    .array(newImgSchema.extend({ id: idSchema.optional() }))
    .max(10)
    .optional(),
  steps: z.array(newStepSchema).min(1).max(50).optional(),
  ingredients: z.array(recipeIngredientInputSchema).min(1).max(50).optional(),
  tags: z.array(recipeTagSchema).min(1).max(10).optional(),
});

// ---------------------------------------------------------------------------
// Recipe: Read
// ---------------------------------------------------------------------------

export const recipeSchema = recipeBaseSchema.extend({
  id: idSchema,
  ownerId: idSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  tags: z.array(newTagSchema.extend({ id: idSchema, slug: z.string() })),
  ingredients: z.array(newRecipeIngredientSchema.extend({ id: idSchema, slug: z.string() })),
  images: z.array(existingImgSchema),
  steps: z.array(existingStepSchema),
  user: userSchema.omit({ email: true }),
});

export const recipeListItemSchema = z.object({
  id: idSchema,
  ownerId: idSchema,
  title: z.string(),
  servingSize: z.number(),
  visibility: z.enum(['public', 'private']),
  createdAt: z.iso.datetime(),
  user: userSchema.omit({ email: true }),
  coverImage: existingImgSchema.nullable(),
  tags: z.array(newTagSchema.extend({ id: idSchema, slug: z.string() })),
});

// ---------------------------------------------------------------------------
// Recipe: Params / Query
// ---------------------------------------------------------------------------

export const recipeIdParamsSchema = z.object({ recipeId: idSchema });

export const listRecipesQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    ingredients: z.string().trim().optional(),
    tags: z.string().trim().optional(),
    search: z.string().trim().max(100).optional(),
    sortBy: z.enum(['title', 'createdAt', 'servingSize']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  })
  .strict();

// ---------------------------------------------------------------------------
// Child resources with their own lifecycle
// ---------------------------------------------------------------------------

export const createRecipeIngredient = z.object({
  recipeId: idSchema,
  ingredients: z.array(recipeIngredientInputSchema).min(1).max(50),
});

export const createRecipeStep = z.object({
  recipeId: idSchema,
  steps: z.array(newStepSchema).min(1).max(50),
});

export const createRecipeImage = z.object({
  recipeId: idSchema,
  images: z.array(newImgSchema).min(1).max(10),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RecipeIdParams = z.infer<typeof recipeIdParamsSchema>;

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeListItem = z.infer<typeof recipeListItemSchema>;

export type CreateRecipe = z.infer<typeof createRecipeSchema>;
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;

export type ListRecipesQuery = z.infer<typeof listRecipesQuerySchema>;
export type ListRecipesQueryParsed = {
  page: number;
  limit: number;
  orderedBy: 'asc' | 'desc';
  sortedBy: 'title' | 'servingSize' | 'createdAt';
  searchTerm: string;
  tagSlugs?: string[];
  ingredientSlugs?: string[];
};

export type CreateIngredient = z.infer<typeof ingredientBaseSchema>;
export type NewRecipeIngredient = z.infer<typeof newRecipeIngredientSchema>;
export type ExistingRecipeIngredient = z.infer<typeof existingRecipeIngredientSchema>;
export type RecipeIngredientInput = z.infer<typeof recipeIngredientInputSchema>;
export type CreateRecipeIngredient = z.infer<typeof createRecipeIngredient>;

export type NewTag = z.infer<typeof newTagSchema>;
export type ExistingTag = z.infer<typeof existingTagSchema>;
export type RecipeTagInput = z.infer<typeof recipeTagSchema>;

export type NewStep = z.infer<typeof newStepSchema>;
export type ExistingStep = z.infer<typeof existingStepSchema>;
export type CreateRecipeStep = z.infer<typeof createRecipeStep>;

export type NewImg = z.infer<typeof newImgSchema>;
export type ExistingImg = z.infer<typeof existingImgSchema>;
export type CreateRecipeImage = z.infer<typeof createRecipeImage>;
