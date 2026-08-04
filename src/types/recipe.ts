import z from 'zod';

const recipeFieldsSchema = z.object({
  title: z.string().min(4),
  ingredients: z
    .array(z.string().min(3))
    .min(1, 'At least one ingredient item is required'),
  steps: z
    .array(z.string().min(3))
    .min(1, 'At least one step item is required'),
  tags: z.array(z.string().min(3)),
});

export const createRecipeSchema = recipeFieldsSchema;
export const updateRecipeSchema = recipeFieldsSchema.partial();
export const recipeSchema = recipeFieldsSchema.extend({
  id: z.string(),
});

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipe = z.infer<typeof createRecipeSchema>;
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;
