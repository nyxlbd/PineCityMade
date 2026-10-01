import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { loginValidation, registerValidation } from '../validations/authValidation.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validateRequest, registerUser);
router.post('/login', authLimiter, loginValidation, validateRequest, loginUser);
router.get('/me', authenticateUser, getCurrentUser);

export default router;
