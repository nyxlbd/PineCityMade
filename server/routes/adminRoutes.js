import express from 'express';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';
import { createAdminCategory, getAdminDashboard, updateCategoryStatus, updateProductStatus, updateSellerStatus, updateUserStatus } from '../controllers/adminController.js';

const router = express.Router();

router.use(authenticateUser, requireAdmin);

router.get('/dashboard', getAdminDashboard);
router.patch('/sellers/:id/status', updateSellerStatus);
router.patch('/products/:id/status', updateProductStatus);
router.patch('/users/:id/status', updateUserStatus);
router.post('/categories', createAdminCategory);
router.patch('/categories/:id/status', updateCategoryStatus);

export default router;
