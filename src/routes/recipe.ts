import { Router } from 'express';
import { getAllRecipes, getRecipeById } from '../controllers/recipe.js';

const router: Router = Router();

router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

export default router;
