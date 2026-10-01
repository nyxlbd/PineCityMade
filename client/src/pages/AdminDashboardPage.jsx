import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const defaultStats = { totalUsers: 0, totalSellers: 0, totalClients: 0, totalProducts: 0, totalOrders: 0, totalSales: 0 };

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(defaultStats);
  const [orders, setOrders] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((response) => {
      const data = response.data?.data || {};
      setStats(data.stats || defaultStats);
      setOrders(data.recentOrders || []);
      setSellers(data.sellers || []);
      setProducts(data.products || []);
      setUsers(data.users || []);
      setCategories(data.categories || []);
    }).finally(() => setLoading(false));
  }, []);

  const updateSellerStatus = async (sellerId, accountStatus) => {
    await api.patch(`/admin/sellers/${sellerId}/status`, { accountStatus });
    setSellers((current) => current.map((seller) => seller._id === sellerId ? { ...seller, accountStatus } : seller));
  };

  const updateProductStatus = async (productId, status) => {
    await api.patch(`/admin/products/${productId}/status`, { status });
    setProducts((current) => current.map((product) => product._id === productId ? { ...product, status } : product));
  };

  const updateUserStatus = async (userId, accountStatus) => {
    await api.patch(`/admin/users/${userId}/status`, { accountStatus });
    setUsers((current) => current.map((item) => item._id === userId ? { ...item, accountStatus } : item));
  };

  const updateCategoryStatus = async (categoryId, isActive) => {
    await api.patch(`/admin/categories/${categoryId}/status`, { isActive });
    setCategories((current) => current.map((item) => item._id === categoryId ? { ...item, isActive } : item));
  };

  const createCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.trim()) return;
    const response = await api.post('/admin/categories', { name: newCategory.trim() });
    setCategories((current) => [...current, response.data.data.category].sort((left, right) => left.name.localeCompare(right.name)));
    setNewCategory('');
  };

  const cards = [
    ['Users', stats.totalUsers],
    ['Sellers', stats.totalSellers],
    ['Products', stats.totalProducts],
    ['Orders', stats.totalOrders],
    ['Sales', `₱${stats.totalSales}`],
  ];

  return (
    <div className="min-h-screen bg-[#f6f2ea] p-6 sm:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Admin console</p>
            <h1 className="mt-2 text-3xl font-black text-stone-900">Good morning, {user?.name || 'Admin'}</h1>
          </div>
          <button onClick={logout} className="self-start rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 sm:self-auto">Logout</button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([label, value]) => <div key={label} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><p className="text-sm text-stone-500">{label}</p><p className="mt-2 text-2xl font-black text-stone-900">{value}</p></div>)}
        </div>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Marketplace activity</p><h2 className="mt-2 text-2xl font-black text-stone-900">Recent orders</h2></div><span className="text-sm text-stone-500">{stats.totalClients} clients</span></div>
          {loading ? <p className="mt-5 text-sm text-stone-500">Loading marketplace data...</p> : orders.length === 0 ? <p className="mt-5 rounded-xl bg-stone-50 p-5 text-sm text-stone-500">No orders have been placed yet.</p> : <div className="mt-5 space-y-3">{orders.map((order) => <div key={order._id} className="grid gap-3 rounded-xl border border-stone-200 p-4 sm:grid-cols-[1fr_auto_auto]"><div><p className="font-semibold text-stone-900">{order.orderNumber}</p><p className="text-sm text-stone-500">{order.client?.name || 'Buyer'} · {order.client?.email || 'No email'}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-center text-xs font-semibold text-amber-800">{order.orderStatus}</span><p className="font-bold text-stone-900">₱{order.totalAmount}</p></div>)}</div>}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Seller review</p>
            <h2 className="mt-2 text-2xl font-black text-stone-900">Seller accounts</h2>
            <div className="mt-5 space-y-3">{sellers.map((seller) => <div key={seller._id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3"><div><p className="font-semibold text-stone-900">{seller.name}</p><p className="text-xs text-stone-500">{seller.email}</p></div><select value={seller.accountStatus} onChange={(event) => updateSellerStatus(seller._id, event.target.value)} className="rounded-lg border border-stone-300 bg-white px-2 py-2 text-xs font-semibold"><option>Pending</option><option>Approved</option><option>Rejected</option><option>Suspended</option></select></div>)}</div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Catalog review</p>
            <h2 className="mt-2 text-2xl font-black text-stone-900">Product moderation</h2>
            <div className="mt-5 space-y-3">{products.map((product) => <div key={product._id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3"><div><p className="font-semibold text-stone-900">{product.name}</p><p className="text-xs text-stone-500">{product.seller?.name || 'Seller'} · ₱{product.price}</p></div><select value={product.status} onChange={(event) => updateProductStatus(product._id, event.target.value)} className="rounded-lg border border-stone-300 bg-white px-2 py-2 text-xs font-semibold"><option>Draft</option><option>Pending Approval</option><option>Published</option><option>Rejected</option><option>Out of Stock</option><option>Archived</option></select></div>)}</div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Accounts</p>
            <h2 className="mt-2 text-2xl font-black text-stone-900">User management</h2>
            <div className="mt-5 space-y-3">{users.map((item) => <div key={item._id} className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3"><div><p className="font-semibold text-stone-900">{item.name}</p><p className="text-xs text-stone-500">{item.role} · {item.email}</p></div><select value={item.accountStatus} onChange={(event) => updateUserStatus(item._id, event.target.value)} className="rounded-lg border border-stone-300 bg-white px-2 py-2 text-xs font-semibold"><option>Pending</option><option>Approved</option><option>Rejected</option><option>Suspended</option></select></div>)}</div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-700">Taxonomy</p>
            <h2 className="mt-2 text-2xl font-black text-stone-900">Category management</h2>
            <form onSubmit={createCategory} className="mt-5 flex gap-2"><input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="New category name" className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-stone-50 px-3 py-2 text-sm" /><button type="submit" className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-semibold text-white">Add</button></form>
            <div className="mt-4 space-y-2">{categories.map((category) => <div key={category._id} className="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2"><span className="text-sm font-semibold text-stone-800">{category.name}</span><button type="button" onClick={() => updateCategoryStatus(category._id, !category.isActive)} className={`rounded-full px-3 py-1 text-xs font-semibold ${category.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>{category.isActive ? 'Active' : 'Inactive'}</button></div>)}</div>
          </section>
        </div>
      </div>
    </div>
  );
}