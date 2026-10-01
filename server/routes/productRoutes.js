import express from 'express';
import { createProduct, getFeaturedProducts, getProductById, getProducts, getTrendingCategories } from '../controllers/productController.js';
import { authenticateUser, requireSeller } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getTrendingCategories);
router.get('/:id', getProductById);
router.post('/', authenticateUser, requireSeller, createProduct);

export default router;
