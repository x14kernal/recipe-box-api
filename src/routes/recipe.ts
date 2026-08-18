import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';
import { validate } from '../middlewares/validate.js';
import { createRecipeSchema, updateRecipeSchema } from '../types/recipe.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router: Router = Router();

// Public
router.get('/', recipeController.getAllRecipes);
router.get('/random', recipeController.getRandomRecipe);
router.get('/:id', recipeController.getById);

router.use(requireAuth);
// Protected
router.post('/', validate(createRecipeSchema), recipeController.createRecipe);
router.patch(
  '/:id',
  validate(updateRecipeSchema),
  recipeController.updateRecipe
);
router.delete('/:id', recipeController.deleteRecipe);

export default router;
