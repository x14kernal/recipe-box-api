import { Router } from 'express';
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getRandomRecipe,
  getRecipeById,
  updateRecipe,
} from '../controllers/recipe.js';
import { validate } from '../middlewares/validate.js';
import { createRecipeSchema, updateRecipeSchema } from '../types/recipe.js';

const router: Router = Router();

router.get('/', getAllRecipes);
router.get('/random', getRandomRecipe);
router.get('/:id', getRecipeById);
router.post('/', validate(createRecipeSchema), createRecipe);
router.put('/:id', validate(updateRecipeSchema), updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
