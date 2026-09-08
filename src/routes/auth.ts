import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema } from '../types/user.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router: Router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

router.use(requireAuth);
router.post('/logout', authController.logout);
router.get('/me', authController.me);

export default router;
