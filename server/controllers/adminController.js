import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

export const getAdminDashboard = async (_req, res) => {
  try {
    const [totalUsers, totalSellers, totalClients, totalProducts, totalOrders, sales, recentOrders, sellers, products, users, categories] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'seller' }),
      User.countDocuments({ role: 'client' }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $match: { orderStatus: { $ne: 'Cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.find().populate('client', 'name email').sort({ createdAt: -1 }).limit(8),
      User.find({ role: 'seller' }).select('name email accountStatus createdAt').sort({ createdAt: -1 }).limit(20),
      Product.find().populate('seller', 'name email').select('name price status seller createdAt').sort({ createdAt: -1 }).limit(20),
      User.find({ role: { $ne: 'admin' } }).select('name email role accountStatus createdAt').sort({ createdAt: -1 }).limit(30),
      Category.find().sort({ name: 1 }),
    ]);

    return successResponse(res, 'Admin dashboard loaded successfully.', {
      stats: {
        totalUsers,
        totalSellers,
        totalClients,
        totalProducts,
        totalOrders,
        totalSales: sales[0]?.total || 0,
      },
      recentOrders,
      sellers,
      products,
      users,
      categories,
    });
  } catch (error) {
    return errorResponse(res, 'Unable to load admin dashboard.', [error.message], 500);
  }
};

export const updateSellerStatus = async (req, res) => {
  try {
    const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Suspended'];
    const { accountStatus } = req.body;

    if (!allowedStatuses.includes(accountStatus)) {
      return errorResponse(res, 'Invalid seller account status.', [], 400);
    }

    const seller = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'seller' },
      { accountStatus },
      { new: true, select: 'name email role accountStatus' },
    );

    if (!seller) return errorResponse(res, 'Seller not found.', [], 404);
    return successResponse(res, 'Seller status updated successfully.', { seller });
  } catch (error) {
    return errorResponse(res, 'Unable to update seller status.', [error.message], 500);
  }
};

export const updateProductStatus = async (req, res) => {
  try {
    const allowedStatuses = ['Draft', 'Pending Approval', 'Published', 'Rejected', 'Out of Stock', 'Archived'];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return errorResponse(res, 'Invalid product status.', [], 400);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('seller', 'name email');

    if (!product) return errorResponse(res, 'Product not found.', [], 404);
    return successResponse(res, 'Product status updated successfully.', { product });
  } catch (error) {
    return errorResponse(res, 'Unable to update product status.', [error.message], 500);
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Suspended'];
    const { accountStatus } = req.body;

    if (!allowedStatuses.includes(accountStatus)) return errorResponse(res, 'Invalid account status.', [], 400);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: { $ne: 'admin' } },
      { accountStatus },
      { new: true, select: 'name email role accountStatus' },
    );

    if (!user) return errorResponse(res, 'User not found.', [], 404);
    return successResponse(res, 'User status updated successfully.', { user });
  } catch (error) {
    return errorResponse(res, 'Unable to update user status.', [error.message], 500);
  }
};

export const createAdminCategory = async (req, res) => {
  try {
    const { name, description = '', image = '' } = req.body;
    if (!name) return errorResponse(res, 'Category name is required.', [], 400);

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await Category.create({ name, slug, description, image, isActive: true });
    return successResponse(res, 'Category created successfully.', { category }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create category.', [error.message], 500);
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { isActive: Boolean(isActive) }, { new: true });
    if (!category) return errorResponse(res, 'Category not found.', [], 404);
    return successResponse(res, 'Category status updated successfully.', { category });
  } catch (error) {
    return errorResponse(res, 'Unable to update category status.', [error.message], 500);
  }
};