import Category from '../models/Category.js';
import { errorResponse, successResponse } from '../utils/apiResponse.js';

const fallbackCategories = [
  { _id: 'fallback-category-1', name: 'Food & Delicacies', slug: 'food-delicacies', description: 'Hearty local flavors and culinary favorites.', image: '', isActive: true },
  { _id: 'fallback-category-2', name: 'Coffee & Beverages', slug: 'coffee-beverages', description: 'Mountain-grown brews and refreshing drinks.', image: '', isActive: true },
  { _id: 'fallback-category-3', name: 'Handicrafts', slug: 'handicrafts', description: 'Traditional crafts made with local artistry.', image: '', isActive: true },
  { _id: 'fallback-category-4', name: 'Woodcraft', slug: 'woodcraft', description: 'Beautifully carved pieces from local makers.', image: '', isActive: true },
  { _id: 'fallback-category-5', name: 'Strawberry Products', slug: 'strawberry-products', description: 'Sweet fruit treats and preserves from the region.', image: '', isActive: true },
  { _id: 'fallback-category-6', name: 'Art & Paintings', slug: 'art-paintings', description: 'Paintings and prints inspired by the Cordillera.', image: '', isActive: true },
  { _id: 'fallback-category-7', name: 'Home & Lifestyle', slug: 'home-lifestyle', description: 'Everyday essentials and cozy local goods.', image: '', isActive: true },
  { _id: 'fallback-category-8', name: 'Souvenirs', slug: 'souvenirs', description: 'Thoughtful keepsakes that celebrate the city.', image: '', isActive: true },
];

export const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return successResponse(res, 'Categories retrieved successfully.', { categories });
  } catch (error) {
    console.warn('MongoDB unavailable for categories. Returning fallback category list.', error.message);
    return successResponse(res, 'Categories retrieved successfully from local fallback data.', { categories: fallbackCategories });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return errorResponse(res, 'Category name is required.', [], 400);
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive: true,
    });

    return successResponse(res, 'Category created successfully.', { category }, 201);
  } catch (error) {
    return errorResponse(res, 'Unable to create category.', [error.message], 500);
  }
};
