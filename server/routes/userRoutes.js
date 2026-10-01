import express from 'express';
import { getCurrentUserProfile, getUsers } from '../controllers/userController.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', authenticateUser, getCurrentUserProfile);
router.get('/', authenticateUser, requireAdmin, getUsers);

export default router;
