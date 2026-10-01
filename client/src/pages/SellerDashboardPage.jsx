import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  stock: '0',
  images: [],
};

const fallbackProductImage = '/sample-stamp.png';

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, totalOrders: 0, totalSales: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState('');

  const loadDashboard = async () => {
    try {
      const [response, categoriesResponse] = await Promise.all([
        api.get('/seller/dashboard'),
        api.get('/categories'),
      ]);
      const payload = response.data?.data || {};
      setStats(payload.stats || stats);
      setProducts(payload.products || []);
      setOrders(payload.orders || []);
      setCategories(categoriesResponse.data?.data?.categories || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load seller dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      await api.patch(`/seller/orders/${orderId}/status`, { orderStatus });
      setMessage('Order status updated successfully.');
      await loadDashboard();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to update order status.');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      let uploadedImages = [];

      if (selectedFiles.length > 0) {
        const imageData = new FormData();
        selectedFiles.forEach((file) => imageData.append('images', file));
        const uploadResponse = await api.post('/seller/uploads', imageData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImages = uploadResponse.data?.data?.files?.map((file) => file.url) || [];
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...form.images, ...uploadedImages],
      };

      if (editingProduct) {
        await api.put(`/seller/products/${editingProduct._id}`, payload);
      } else {
        await api.post('/seller/products', payload);
      }
      setForm(initialForm);
      setSelectedFiles([]);
      setEditingProduct(null);
      setMessage(editingProduct ? 'Product updated successfully.' : 'Product listed successfully.');
      await loadDashboard();
    } catch (error) {
      setMessage(error.response?.data?.message || (editingProduct ? 'Unable to update the listing.' : 'Unable to create the listing.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f2ea] p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Seller dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-stone-900">Welcome back, {user?.name || 'Seller'}</h1>
          </div>

          <Link to="/dashboard" className="inline-flex items-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700">
            Back to account
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Total listings</p>
            <p className="mt-2 text-3xl font-black text-stone-900">{stats.totalProducts}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Active products</p>
            <p className="mt-2 text-3xl font-black text-stone-900">{stats.activeProducts}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Orders</p>
            <p className="mt-2 text-3xl font-black text-stone-900">{stats.totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-stone-500">Sales</p>
            <p className="mt-2 text-3xl font-black text-stone-900">₱{stats.totalSales}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <form className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-stone-900">{editingProduct ? 'Edit product' : 'Add a new product'}</h2>
              {editingProduct ? (
                <button type="button" onClick={() => { setEditingProduct(null); setForm(initialForm); setMessage(''); }} className="text-sm font-semibold text-stone-500 hover:text-stone-900">
                  Cancel
                </button>
              ) : null}
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Product name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Price</label>
                  <input name="price" type="number" min="0" value={form.price} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Stock</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Product images</label>
                <input
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  onChange={(event) => setSelectedFiles(Array.from(event.target.files || []))}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm"
                />
                <p className="mt-1 text-xs text-stone-500">Upload up to 6 JPG, PNG, WEBP, or GIF files, 5 MB each.</p>
                {selectedFiles.length > 0 ? <p className="mt-1 text-xs font-medium text-emerald-700">{selectedFiles.length} image(s) selected</p> : null}
              </div>

              {message ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}

              <button type="submit" disabled={saving} className="w-full rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? 'Saving...' : editingProduct ? 'Save changes' : 'Publish product'}
              </button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-stone-900">Recent listings</h2>
            </div>

            {loading ? (
              <div className="text-sm text-stone-500">Loading your products...</div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
                No products yet. Add your first listing to begin selling.
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product._id} className="flex gap-4 rounded-2xl border border-stone-200 p-3">
                    {(() => {
                      const productImages = product.images || [];

                      return (
                    <img
                      src={productImages[0] || fallbackProductImage}
                      alt={product.name}
                      onError={(event) => {
                        const nextImageIndex = Number(event.currentTarget.dataset.imageIndex || 0) + 1;

                        if (nextImageIndex < productImages.length) {
                          event.currentTarget.dataset.imageIndex = String(nextImageIndex);
                          event.currentTarget.src = productImages[nextImageIndex];
                          return;
                        }

                        event.currentTarget.onerror = null;
                        event.currentTarget.src = fallbackProductImage;
                      }}
                      data-image-index="0"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                      );
                    })()}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-lg font-semibold text-stone-900">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">{product.status}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setForm({
                                name: product.name || '',
                                description: product.description || '',
                                price: String(product.price ?? ''),
                                category: product.category?._id || product.category || '',
                                stock: String(product.stock ?? 0),
                                images: product.images || [],
                              });
                              setSelectedFiles([]);
                              setMessage('');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-stone-600">{product.category?.name || 'General'}</p>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-stone-900">₱{product.price}</span>
                        <span className="text-stone-500">{product.stock} in stock</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Fulfillment</p>
              <h2 className="mt-2 text-2xl font-black text-stone-900">Incoming orders</h2>
            </div>
            <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">{orders.length} orders</span>
          </div>

          {orders.length === 0 ? (
            <p className="mt-5 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-500">Orders for your products will appear here.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {orders.map((order) => (
                <div key={order._id} className="grid gap-4 rounded-2xl border border-stone-200 p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <p className="font-semibold text-stone-900">{order.orderNumber}</p>
                    <p className="mt-1 text-sm text-stone-500">{order.client?.name || 'Buyer'} · {order.items.map((item) => `${item.productName} x${item.quantity}`).join(', ')}</p>
                  </div>
                  <p className="font-bold text-stone-900">₱{order.items.reduce((sum, item) => sum + item.subtotal, 0)}</p>
                  <select value={order.orderStatus} onChange={(event) => updateOrderStatus(order._id, event.target.value)} className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700">
                    {['Pending', 'Confirmed', 'Processing', 'Ready for Shipment', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
