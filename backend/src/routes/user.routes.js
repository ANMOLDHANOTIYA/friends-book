import {Router} from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import asynchandler from '../utils/asyncHandler.js';
import validate from '../middlewares/validate.middleware.js';
import { registerUserSchema, loginUserSchema } from '../validators/user.validator.js';


const router = Router();

router.post('/register', validate(registerUserSchema), asynchandler(registerUser));
router.post('/login', validate(loginUserSchema), asynchandler(loginUser));

export default router;