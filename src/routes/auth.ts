import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, signupSchema } from '../types/user.js';

const router: Router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

export default router;
