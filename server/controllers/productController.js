import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

const fallbackProducts = [
  {
    _id: 'fallback-product-1',
    name: 'Baguio Strawberry Jam',
    slug: 'baguio-strawberry-jam',
    description: 'Small-batch jam made from locally grown berries.',
    price: 280,
    discountPrice: 350,
    category: { _id: 'fallback-category-5', name: 'Strawberry Products' },
    seller: { _id: 'fallback-seller-1', name: 'Baguio Harvest Co.', email: 'hello@baguioharvest.com' },
    images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'],
    rating: 4.9,
    reviewCount: 124,
    soldCount: 85,
    status: 'Published',
    location: 'Baguio',
  },
  {
    _id: 'fallback-product-2',
    name: 'Cordillera Coffee Beans',
    slug: 'cordillera-coffee-beans',
    description: 'Rich, aromatic beans grown in cooler mountain climate.',
    price: 420,
    discountPrice: 500,
    category: { _id: 'fallback-category-2', name: 'Coffee & Beverages' },
    seller: { _id: 'fallback-seller-2', name: 'Mountain Brew Lab', email: 'hello@mountainbrew.com' },
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80'],
    rating: 4.8,
    reviewCount: 86,
    soldCount: 62,
    status: 'Published',
    location: 'La Trinidad',
  },
  {
    _id: 'fallback-product-3',
    name: 'Handwoven Tote Bag',
    slug: 'handwoven-tote-bag',
    description: 'A durable woven carryall inspired by local weaving traditions.',
    price: 650,
    discountPrice: 780,
    category: { _id: 'fallback-category-3', name: 'Handicrafts' },
    seller: { _id: 'fallback-seller-3', name: 'Pine & Thread Studio', email: 'hello@pineandthread.com' },
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
    rating: 4.7,
    reviewCount: 72,
    soldCount: 48,
    status: 'Published',
    location: 'Baguio',
  },
  {
    _id: 'fallback-product-4',
    name: 'Wooden Mountain Souvenir',
    slug: 'wooden-mountain-souvenir',
    description: 'Carved keepsake celebrating the mountain landscape.',
    price: 520,
    discountPrice: 600,
    category: { _id: 'fallback-category-4', name: 'Woodcraft' },
    seller: { _id: 'fallback-seller-4', name: 'Moss & Pine Crafts', email: 'hello@mossandpine.com' },
    images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'],
    rating: 4.9,
    reviewCount: 140,
    soldCount: 96,
    status: 'Published',
    location: 'Baguio',
  },
];

const buildSlug = (name, existingSlug = '') => {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (!existingSlug) {
    return baseSlug || 'product';
  }

  return `${baseSlug}-${existingSlug}`;
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, sort = 'newest', page = 1, limit = 12 } = req.query;

    const filter = { status: 'Published' };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      rating: { rating: -1 },
      'best-selling': { soldCount: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category')
      .populate('seller', 'name email role')
      .sort(sortMap[sort] || sortMap.newest)
      .skip(skip)
      .limit(Number(limit));

    return successResponse(res, 'Products retrieved successfully.', {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.warn('MongoDB unavailable for products. Returning fallback product list.', error.message);
    const requestedPage = Number(req.query.page || 1);
    const requestedLimit = Number(req.query.limit || 12);

    return successResponse(res, 'Products retrieved successfully from local fallback data.', {
      products: fallbackProducts,
      pagination: {
        page: requestedPage,
        limit: requestedLimit,
        total: fallbackProducts.length,
        totalPages: 1,
      },
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('seller', 'name email profileImage');

    if (!product) {
      return errorResponse(res, 'Product not found.', [], 404);
    }

    return successResponse(res, 'Product details retrieved successfully.', { product });
  } catch (error) {
    const fallbackProduct = fallbackProducts.find((product) => product._id === req.params.id);

    if (fallbackProduct) {
      return successResponse(res, 'Product details retrieved successfully from local fallback data.', { product: fallbackProduct });
    }

    return errorResponse(res, 'Unable to fetch product details.', [error.message], 500);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock = 0, images = [], discountPrice = 0 } = req.body;
    const sellerId = req.user?.id || req.user?._id;

    if (!name || !description || !price || !category) {
      return errorResponse(res, 'Name, description, price, and category are required.', [], 400);
    }

    if (!sellerId) {
      return errorResponse(res, 'Seller information is required to list a product.', [], 400);
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = baseSlug || 'product';
    let slugCounter = 1;

    while (await Product.exists({ slug })) {
      slug = `${baseSlug}-${slugCounter}`;
      slugCounter += 1;
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice) || 0,
      category,
      stock: Number(stock),
      seller: sellerId,
      images: Array.isArray(images) ? images : [images].filter(Boolean),
      status: 'Published',
      isFeatured: false,
    });

    return successResponse(res, 'Product created successfully.', { product }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create product.', [error.message], 500);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const sellerId = req.user?.id || req.user?._id;
    const { name, description, price, category, stock = 0, images = [], discountPrice = 0 } = req.body;

    if (!sellerId) {
      return errorResponse(res, 'Seller identity is required.', [], 400);
    }

    if (!name || !description || price === undefined || !category) {
      return errorResponse(res, 'Name, description, price, and category are required.', [], 400);
    }

    const product = await Product.findOne({ _id: req.params.id, seller: sellerId });

    if (!product) {
      return errorResponse(res, 'Product not found or you do not own it.', [], 404);
    }

    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.discountPrice = Number(discountPrice) || 0;
    product.category = category;
    product.stock = Number(stock);
    product.images = Array.isArray(images) ? images : [images].filter(Boolean);

    await product.save();

    return successResponse(res, 'Product updated successfully.', { product });
  } catch (error) {
    return errorResponse(res, 'Unable to update product.', [error.message], 500);
  }
};

export const getFeaturedProducts = async (_req, res) => {
  try {
    const products = await Product.find({ status: 'Published', isFeatured: true }).limit(6);
    return successResponse(res, 'Featured products retrieved.', { products });
  } catch (error) {
    console.warn('MongoDB unavailable for featured products. Returning fallback product list.', error.message);
    return successResponse(res, 'Featured products retrieved successfully from local fallback data.', { products: fallbackProducts.slice(0, 4) });
  }
};

export const getTrendingCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).limit(8);
    return successResponse(res, 'Categories retrieved successfully.', { categories });
  } catch (error) {
    console.warn('MongoDB unavailable for trending categories. Returning fallback category list.', error.message);
    return successResponse(res, 'Categories retrieved successfully from local fallback data.', { categories: fallbackProducts.slice(0, 4).map((product) => ({
      _id: product.category._id,
      name: product.category.name,
      slug: product.category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `Curated local items in ${product.category.name.toLowerCase()}.`,
      image: '',
      isActive: true,
    })) });
  }
};
