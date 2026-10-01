import { ArrowRight, BadgeCheck, Leaf, MapPin, Mountain, PackageCheck, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const fallbackCategories = [
  { name: 'Food & Delicacies', icon: '🍲' },
  { name: 'Coffee & Beverages', icon: '☕' },
  { name: 'Handicrafts', icon: '🧵' },
  { name: 'Woodcraft', icon: '🪵' },
  { name: 'Strawberry Products', icon: '🍓' },
  { name: 'Art & Paintings', icon: '🎨' },
  { name: 'Home & Lifestyle', icon: '🏡' },
  { name: 'Souvenirs', icon: '🎁' },
];

const fallbackProducts = [
  {
    name: 'Baguio Strawberry Jam',
    category: 'Strawberry Products',
    location: 'Baguio',
    description: 'Small-batch jam made from locally grown berries.',
    rating: 4.9,
    reviews: 124,
    price: 280,
    oldPrice: 350,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Cordillera Coffee Beans',
    category: 'Coffee & Beverages',
    location: 'La Trinidad',
    description: 'Rich, aromatic beans grown in cooler mountain climate.',
    rating: 4.8,
    reviews: 86,
    price: 420,
    oldPrice: 500,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Handwoven Tote Bag',
    category: 'Handicrafts',
    location: 'Baguio',
    description: 'A durable woven carryall inspired by local weaving traditions.',
    rating: 4.7,
    reviews: 72,
    price: 650,
    oldPrice: 780,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Wooden Mountain Souvenir',
    category: 'Woodcraft',
    location: 'Baguio',
    description: 'Carved keepsake celebrating the mountain landscape.',
    rating: 4.9,
    reviews: 140,
    price: 520,
    oldPrice: 600,
    image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
  },
];

const sellers = [
  { name: 'Baguio Harvest Co.', location: 'Session Road', sales: 1680 },
  { name: 'Pine & Thread Studio', location: 'Asin Road', sales: 1420 },
  { name: 'Mountain Brew Lab', location: 'Camp John Hay', sales: 1980 },
  { name: 'Moss & Pine Crafts', location: 'Bakakeng', sales: 1310 },
];

const categoryIcons = ['🍲', '☕', '🧵', '🪵', '🍓', '🎨', '🏡', '🎁'];

const normalizeProduct = (product) => {
  const imageList = Array.isArray(product.images) ? product.images : [];

  return {
    _id: product._id,
    name: product.name,
    category: product.category?.name || product.category || 'Local find',
    location: product.location || 'Baguio City',
    description: product.description || 'Locally made and loved by our community.',
    rating: product.rating ?? 4.8,
    reviews: product.reviewCount ?? product.reviews ?? 0,
    price: Number(product.price ?? 0),
    oldPrice: product.discountPrice && Number(product.discountPrice) > Number(product.price || 0) ? Number(product.discountPrice) : null,
    image: imageList[imageList.length - 1] || product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
  };
};

export default function HomePage() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=12&sort=newest'),
        ]);

        const categoryData = categoriesResponse.data?.data?.categories?.length ? categoriesResponse.data.data.categories : fallbackCategories;
        const productData = productsResponse.data?.data?.products?.length ? productsResponse.data.data.products : fallbackProducts;

        setCategories(
          categoryData.map((category, index) => ({
            name: category.name,
            icon: category.icon || categoryIcons[index % categoryIcons.length],
          })),
        );
        setProducts(productData.map(normalizeProduct));
      } catch (error) {
        setCategories(fallbackCategories);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplaceData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-stone-800 antialiased">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#f8f0e5_0%,#f4efe8_30%,#eef9f2_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-700/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                <Leaf className="h-3.5 w-3.5" />
                Made Local. Made in Pine City.
              </span>
              <h2 className="max-w-xl text-4xl font-black tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                Discover the best of Baguio, made by local hands.
              </h2>
              <p className="mt-6 max-w-lg text-lg leading-8 text-stone-600">
                Pine City Made brings together artisan goods, mountain-grown flavors, and community-made stories from across Baguio City and the Cordillera.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800"
                >
                  Shop now
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-stone-400">
                  Become a seller
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-8 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-700" />
                  Verified local sellers
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-emerald-700" />
                  Fresh local products
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -right-4 h-28 w-28 rounded-full bg-emerald-300/30 blur-3xl" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/80 p-4 shadow-[0_24px_80px_rgba(25,38,33,0.08)] backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
                  alt="Baguio mountain view"
                  className="h-[520px] w-full rounded-[1.5rem] object-cover"
                />
                <div className="absolute bottom-10 left-10 right-10 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur">
                  <div className="flex items-center justify-between text-sm font-medium text-stone-600">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-700" />
                      Baguio City
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Local picks</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">Top rated</p>
                      <p className="text-xl font-black text-stone-900">Mountain Harvest Box</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-sm font-semibold text-amber-700">
                      <Star className="h-4 w-4 fill-current" />
                      4.9
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Explore</p>
              <h3 className="mt-2 text-3xl font-black text-stone-900">Featured categories</h3>
            </div>
            <button className="text-sm font-semibold text-emerald-700">View all categories</button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div key={category.name} className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">{category.icon}</div>
                <h4 className="text-xl font-semibold text-stone-900">{category.name}</h4>
                <p className="mt-2 text-sm text-stone-600">Handpicked local finds curated for the Pine City community.</p>
              </div>
            ))}
          </div>
        </section>

        <section id="featured" className="bg-stone-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">Handpicked</p>
                <h3 className="mt-2 text-3xl font-black">Featured local products</h3>
              </div>
              <button className="text-sm font-semibold text-emerald-300">See more</button>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-r from-emerald-700 to-emerald-900 p-8 text-white shadow-xl sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">Fresh picks</p>
                <h3 className="mt-2 text-3xl font-black">Fresh arrivals from Baguio makers</h3>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">
                Browse new arrivals
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="sellers" className="bg-[#fffdf9] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Community</p>
                <h3 className="mt-2 text-3xl font-black text-stone-900">Featured local sellers</h3>
              </div>
              <button className="text-sm font-semibold text-emerald-700">Meet more sellers</button>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {sellers.map((seller) => (
                <div key={seller.name} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-teal-500 text-lg font-black text-white">
                    {seller.name.slice(0, 1)}
                  </div>
                  <h4 className="text-xl font-semibold text-stone-900">{seller.name}</h4>
                  <p className="mt-2 flex items-center gap-2 text-sm text-stone-500">
                    <MapPin className="h-4 w-4 text-emerald-700" />
                    {seller.location}
                  </p>
                  <p className="mt-4 text-sm text-stone-600">{seller.sales} sales this season</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] bg-stone-200">
              <img
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80"
                alt="Baguio artisan market"
                className="h-[440px] w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">About Pine City Made</p>
              <h3 className="mt-2 text-3xl font-black text-stone-900">Celebrating Baguio’s makers, flavors, and mountain culture.</h3>
              <p className="mt-5 text-lg leading-8 text-stone-600">
                Pine City Made is designed to help Baguio-based sellers reach more households while making it easier for shoppers to find authentic local products, cultural goods, and handcrafted items that reflect the city’s identity.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <Mountain className="mb-3 h-8 w-8 text-emerald-700" />
                  <h4 className="text-lg font-semibold text-stone-900">Mountain-made</h4>
                  <p className="mt-2 text-sm text-stone-600">Inspired by the Cordillera and the pine-laced culture of Baguio.</p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                  <ShieldCheck className="mb-3 h-8 w-8 text-emerald-700" />
                  <h4 className="text-lg font-semibold text-stone-900">Trusted marketplace</h4>
                  <p className="mt-2 text-sm text-stone-600">Built around protection, local trust, and a clean customer experience.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
