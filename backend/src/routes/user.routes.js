import {Router} from 'express';
import {registerUser} from '../controllers/user.controller.js';
import asynchandler from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', asynchandler(registerUser));

export default router;