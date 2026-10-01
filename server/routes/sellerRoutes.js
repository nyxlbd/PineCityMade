import express from 'express';
import { authenticateUser, requireSeller } from '../middleware/auth.js';
import { createProduct, updateProduct } from '../controllers/productController.js';
import { getSellerDashboard, updateSellerOrderStatus } from '../controllers/sellerController.js';
import { attachImageMetadata } from '../services/imageService.js';
import { upload } from '../utils/upload.js';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

router.use(authenticateUser, requireSeller);

router.get('/dashboard', getSellerDashboard);
router.patch('/orders/:id/status', updateSellerOrderStatus);
router.post('/uploads', upload.array('images', 6), async (req, res) => {
	const files = await Promise.all((req.files || []).map(attachImageMetadata));
	return successResponse(res, 'Images uploaded successfully.', { files });
});
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);

export default router;
