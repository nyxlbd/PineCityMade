import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price images description category',
    });

    return successResponse(res, 'Cart retrieved successfully.', {
      cart: cart || { user: userId, items: [] },
    });
  } catch (error) {
    return errorResponse(res, 'Unable to retrieve cart.', [error.message], 500);
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId, quantity = 1, selectedVariant = '' } = req.body;

    if (!productId) {
      return errorResponse(res, 'Product ID is required.', [], 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 'Product not found.', [], 404);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId && item.selectedVariant === selectedVariant);

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        selectedVariant,
      });
    }

    await cart.save();

    const populatedCart = await cart.populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price images description category',
    });

    return successResponse(res, 'Item added to cart.', { cart: populatedCart }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to add item to cart.', [error.message], 500);
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId, quantity, selectedVariant = '' } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, 'Cart not found.', [], 404);
    }

    const item = cart.items.find((entry) => entry.product.toString() === productId && entry.selectedVariant === selectedVariant);
    if (!item) {
      return errorResponse(res, 'Cart item not found.', [], 404);
    }

    item.quantity = Math.max(1, Number(quantity) || 1);
    await cart.save();

    return successResponse(res, 'Cart item updated successfully.', { cart });
  } catch (error) {
    return errorResponse(res, 'Unable to update cart item.', [error.message], 500);
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { productId, selectedVariant = '' } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return errorResponse(res, 'Cart not found.', [], 404);
    }

    cart.items = cart.items.filter((entry) => !(entry.product.toString() === productId && entry.selectedVariant === selectedVariant));
    await cart.save();

    return successResponse(res, 'Cart item removed successfully.', { cart });
  } catch (error) {
    return errorResponse(res, 'Unable to remove cart item.', [error.message], 500);
  }
};

export const checkout = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { shippingAddress, paymentMethod = 'Cash on Delivery', items: requestedItems = [] } = req.body;

    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'Product',
      select: 'name price seller stock',
    });

    if ((!cart || cart.items.length === 0) && requestedItems.length === 0) {
      return errorResponse(res, 'Your cart is empty.', [], 400);
    }

    if ((!cart || cart.items.length === 0) && requestedItems.length > 0) {
      const productIds = requestedItems.map((item) => item.productId);
      const products = await Product.find({ _id: { $in: productIds } }).select('name price seller stock');
      const productMap = new Map(products.map((product) => [product._id.toString(), product]));

      cart = {
        items: requestedItems.map((item) => ({
          product: productMap.get(item.productId),
          quantity: Number(item.quantity) || 1,
        })),
      };
    }

    if (cart.items.some((item) => !item.product)) {
      return errorResponse(res, 'One or more products are no longer available.', [], 400);
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      seller: item.product.seller,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      subtotal: item.quantity * item.product.price,
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    const orderNumber = `PCM-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      client: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      totalAmount,
    });

    if (cart._id) {
      cart.items = [];
      await cart.save();
    }

    return successResponse(res, 'Checkout successful.', { order }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to complete checkout.', [error.message], 500);
  }
};

export const getClientOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const orders = await Order.find({ client: userId }).sort({ createdAt: -1 }).limit(10);
    return successResponse(res, 'Orders retrieved successfully.', { orders });
  } catch (error) {
    return errorResponse(res, 'Unable to retrieve orders.', [error.message], 500);
  }
};
