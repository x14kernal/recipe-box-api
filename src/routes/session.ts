import { requireAuth } from '../middlewares/requireAuth.js';
import { Router } from 'express';

import * as sessionController from '../controllers/sessionController.js';

const router: Router = Router();

router.use(requireAuth);

router.get('/', sessionController.getAllSessions);
router.delete('/:id', sessionController.deleteSession);

export default router;
