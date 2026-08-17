import { Router } from 'express';
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getById,
  getRandomRecipe,
  updateRecipe,
} from '../controllers/recipe.js';
import { validate } from '../middlewares/validate.js';
import { createRecipeSchema, updateRecipeSchema } from '../types/recipe.js';

const router: Router = Router();

router.get('/', getAllRecipes);
router.get('/random', getRandomRecipe);
router.get('/:id', getById);
router.post('/', validate(createRecipeSchema), createRecipe);
router.patch('/:id', validate(updateRecipeSchema), updateRecipe);
router.delete('/:id', deleteRecipe);

export default router;
