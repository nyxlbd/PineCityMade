import express from 'express';
import { addToCart, checkout, getCart, getClientOrders, removeCartItem, updateCartItem } from '../controllers/cartController.js';
import { authenticateUser, requireClient } from '../middleware/auth.js';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

router.use(authenticateUser, requireClient);

router.get('/dashboard', (_req, res) => {
  return successResponse(res, 'Client dashboard access granted.', {
    stats: {
      wishlistCount: 0,
      orderCount: 0,
      cartItems: 0,
    },
  });
});

router.get('/cart', getCart);
router.post('/cart/add', addToCart);
router.put('/cart/update', updateCartItem);
router.delete('/cart/remove', removeCartItem);
router.post('/checkout', checkout);
router.get('/orders', getClientOrders);

export default router;
