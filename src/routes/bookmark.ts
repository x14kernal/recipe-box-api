import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { listRecipesQuerySchema } from '../types/recipe.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import * as bookmarkController from '../controllers/bookmarkController.js';

const router: Router = Router();

router.get('/', [requireAuth, validate(listRecipesQuerySchema, 'query')], bookmarkController.getAllBookmarks);

export default router;
