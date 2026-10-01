import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import AdminDashboardPage from './AdminDashboardPage';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.role !== 'client') return;

    api.get('/client/orders').then((response) => {
      setOrders(response.data?.data?.orders || []);
    }).catch(() => {
      setOrders([]);
    });
  }, [user]);

  if (user?.role === 'admin') {
    return <AdminDashboardPage />;
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] p-6 sm:p-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-stone-900">Welcome, {user?.name || 'User'}</h1>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'seller' ? (
              <Link to="/seller" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                Seller tools
              </Link>
            ) : null}
            <button
              onClick={logout}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-400"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">Role</p>
            <p className="mt-2 text-2xl font-black text-stone-900">{user?.role}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">{user?.email}</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm text-stone-500">Status</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">{user?.accountStatus || 'Active'}</p>
          </div>
        </div>

        {user?.role === 'client' ? (
          <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
            <h2 className="text-2xl font-black text-stone-900">Recent orders</h2>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-stone-500">Your completed orders will appear here.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 p-4">
                    <div>
                      <p className="font-semibold text-stone-900">{order.orderNumber}</p>
                        <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.map((item) => `${item.productName} x${item.quantity}`).join(', ')}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{order.orderStatus}</span>
                    <p className="font-bold text-stone-900">₱{order.totalAmount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
