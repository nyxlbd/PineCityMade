import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Ready for Shipment', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user?.id || req.user?._id;

    if (!sellerId) {
      return errorResponse(res, 'Seller identity is required.', [], 400);
    }

    const [totalProducts, publishedProducts, recentProducts, orders] = await Promise.all([
      Product.countDocuments({ seller: sellerId }),
      Product.countDocuments({ seller: sellerId, status: 'Published' }),
      Product.find({ seller: sellerId })
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(8),
      Order.find({ 'items.seller': sellerId })
        .populate('client', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(20),
    ]);

    const sellerOrders = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter((item) => item.seller.toString() === sellerId.toString()),
    }));
    const totalRevenue = sellerOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.subtotal, 0), 0);

    return successResponse(res, 'Seller dashboard loaded successfully.', {
      stats: {
        totalProducts,
        activeProducts: publishedProducts,
        totalOrders: sellerOrders.length,
        totalSales: totalRevenue,
      },
      products: recentProducts,
      orders: sellerOrders,
    });
  } catch (error) {
    return errorResponse(res, 'Unable to load seller dashboard.', [error.message], 500);
  }
};

export const updateSellerOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user?.id || req.user?._id;
    const { orderStatus } = req.body;

    if (!orderStatuses.includes(orderStatus)) {
      return errorResponse(res, 'Invalid order status.', [], 400);
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, 'items.seller': sellerId },
      { orderStatus },
      { new: true },
    ).populate('client', 'name email phone');

    if (!order) {
      return errorResponse(res, 'Order not found or not assigned to this seller.', [], 404);
    }

    return successResponse(res, 'Order status updated successfully.', { order });
  } catch (error) {
    return errorResponse(res, 'Unable to update order status.', [error.message], 500);
  }
};
