import { Router } from 'express';
import * as ingredientController from '../controllers/ingredientController.js';

const router: Router = Router();

router.get('/', ingredientController.getAllIngredients);

export default router;
