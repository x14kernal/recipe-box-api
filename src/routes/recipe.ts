import { Router } from 'express';
import * as recipeController from '../controllers/recipeController.js';
import { validate } from '../middlewares/validate.js';
import { createRecipeSchema, listRecipesQuerySchema, updateRecipeSchema } from '../types/recipe.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router: Router = Router();

router.get('/', validate(listRecipesQuerySchema, 'query'), recipeController.getAllRecipes);

router.get('/mine', [requireAuth, validate(listRecipesQuerySchema, 'query')], recipeController.getMyRecipes);
router.get('/mine/:id', requireAuth, recipeController.getMyRecipeById);

router.get('/trash', [requireAuth, validate(listRecipesQuerySchema, 'query')], recipeController.getMyTrashedRecipes);
router.get('/trash/:id', requireAuth, recipeController.getTrashedById);

router.get('/random', recipeController.getRandomRecipe);
router.get('/:id', recipeController.getById);

// Protected
router.use(requireAuth);

router.post('/', validate(createRecipeSchema), recipeController.createRecipe);

router.delete('/:id', recipeController.deleteRecipe);
router.patch('/:id', validate(updateRecipeSchema), recipeController.updateRecipe);

router.patch('/:id/trash', recipeController.moveRecipeToTrash);
router.patch('/:id/restore', recipeController.restoreRecipeFromTrash);

router.post('/:id/bookmark', recipeController.addToBookmarks);
router.delete('/:id/bookmark', recipeController.removeFromBookmarks);

export default router;
