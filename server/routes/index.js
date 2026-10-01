import express from 'express';
import mongoose from 'mongoose';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import clientRoutes from './clientRoutes.js';
import productRoutes from './productRoutes.js';
import sellerRoutes from './sellerRoutes.js';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.get('/health', (_req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Pine City Made API is healthy.',
    data: {
      name: 'Pine City Made',
      environment: process.env.NODE_ENV || 'development',
      mongoConnected: mongoose.connection.readyState === 1,
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.use('/seller', sellerRoutes);
router.use('/client', clientRoutes);

export default router;
