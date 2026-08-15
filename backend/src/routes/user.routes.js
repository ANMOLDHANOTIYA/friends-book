import {Router} from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/user.controller.js';
import asyncHandler from '../utils/asyncHandler.js';
import validate from '../middlewares/validate.middleware.js';
import { registerUserSchema, loginUserSchema } from '../validators/user.validator.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerUserSchema), asyncHandler(registerUser));
router.post('/login', validate(loginUserSchema), asyncHandler(loginUser));
router.get( '/profile', verifyJWT, asyncHandler(getCurrentUser));

export default router;