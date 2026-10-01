import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pine-city-made';

const categories = [
  { name: 'Food & Delicacies', slug: 'food-delicacies', description: 'Hearty local flavors and culinary favorites.', image: '' },
  { name: 'Coffee & Beverages', slug: 'coffee-beverages', description: 'Mountain-grown brews and refreshing drinks.', image: '' },
  { name: 'Handicrafts', slug: 'handicrafts', description: 'Traditional crafts made with local artistry.', image: '' },
  { name: 'Woodcraft', slug: 'woodcraft', description: 'Beautifully carved pieces from local makers.', image: '' },
  { name: 'Strawberry Products', slug: 'strawberry-products', description: 'Sweet fruit treats and preserves from the region.', image: '' },
  { name: 'Art & Paintings', slug: 'art-paintings', description: 'Paintings and prints inspired by the Cordillera.', image: '' },
  { name: 'Home & Lifestyle', slug: 'home-lifestyle', description: 'Everyday essentials and cozy local goods.', image: '' },
  { name: 'Souvenirs', slug: 'souvenirs', description: 'Thoughtful keepsakes that celebrate the city.', image: '' },
];

const seedDemoData = async () => {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB:', mongoose.connection.host);

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const sellerPassword = await bcrypt.hash('Seller123!', 10);
  const clientPassword = await bcrypt.hash('Client123!', 10);

  const admin = await User.findOneAndUpdate(
    { email: 'admin@pinecitymade.com' },
    {
      name: 'Pine City Admin',
      email: 'admin@pinecitymade.com',
      password: adminPassword,
      role: 'admin',
      phone: '09171234567',
      address: 'Baguio City',
      barangay: 'Session Road',
      accountStatus: 'Approved',
    },
    { upsert: true, new: true },
  );

  const seller = await User.findOneAndUpdate(
    { email: 'seller@pinecitymade.com' },
    {
      name: 'Baguio Harvest Co.',
      email: 'seller@pinecitymade.com',
      password: sellerPassword,
      role: 'seller',
      phone: '09234567890',
      address: 'Baguio City',
      barangay: 'Asin Road',
      accountStatus: 'Approved',
    },
    { upsert: true, new: true },
  );

  const client = await User.findOneAndUpdate(
    { email: 'buyer@pinecitymade.com' },
    {
      name: 'Test Buyer',
      email: 'buyer@pinecitymade.com',
      password: clientPassword,
      role: 'client',
      phone: '09345678901',
      address: 'Baguio City',
      barangay: 'Camp John Hay',
      accountStatus: 'Approved',
    },
    { upsert: true, new: true },
  );

  const createdCategories = [];
  for (const item of categories) {
    const category = await Category.findOneAndUpdate(
      { slug: item.slug },
      { ...item, isActive: true },
      { upsert: true, new: true },
    );
    createdCategories.push(category);
  }

  const categoryMap = Object.fromEntries(createdCategories.map((category) => [category.slug, category._id]));

  const products = [
    {
      seller: seller._id,
      name: 'Baguio Strawberry Jam',
      slug: 'baguio-strawberry-jam',
      description: 'Small-batch jam made from locally grown berries.',
      price: 280,
      discountPrice: 350,
      category: categoryMap['strawberry-products'],
      images: ['https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80'],
      stock: 25,
      status: 'Published',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 124,
      soldCount: 85,
    },
    {
      seller: seller._id,
      name: 'Cordillera Coffee Beans',
      slug: 'cordillera-coffee-beans',
      description: 'Rich, aromatic beans grown in cooler mountain climate.',
      price: 420,
      discountPrice: 500,
      category: categoryMap['coffee-beverages'],
      images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80'],
      stock: 18,
      status: 'Published',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 86,
      soldCount: 62,
    },
    {
      seller: seller._id,
      name: 'Handwoven Tote Bag',
      slug: 'handwoven-tote-bag',
      description: 'A durable woven carryall inspired by local weaving traditions.',
      price: 650,
      discountPrice: 780,
      category: categoryMap['handicrafts'],
      images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
      stock: 12,
      status: 'Published',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 72,
      soldCount: 48,
    },
    {
      seller: seller._id,
      name: 'Wooden Mountain Souvenir',
      slug: 'wooden-mountain-souvenir',
      description: 'Carved keepsake celebrating the mountain landscape.',
      price: 520,
      discountPrice: 600,
      category: categoryMap['woodcraft'],
      images: ['https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80'],
      stock: 20,
      status: 'Published',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 140,
      soldCount: 96,
    },
  ];

  for (const product of products) {
    await Product.findOneAndUpdate(
      { slug: product.slug },
      product,
      { upsert: true, new: true },
    );
  }

  console.log('Seed complete.');
  console.log('Users:', { admin: admin.email, seller: seller.email, client: client.email });
  console.log('Categories:', createdCategories.length);
  console.log('Products:', products.length);

  await mongoose.disconnect();
};

seedDemoData().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
