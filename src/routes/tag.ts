import { Router } from 'express';
import * as tagController from '../controllers/tagController.js';

const router: Router = Router();

router.get('/', tagController.getAllTags);

export default router;
