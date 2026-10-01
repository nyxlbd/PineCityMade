import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Baguio City',
    paymentMethod: 'Cash on Delivery',
  });

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await api.post('/client/checkout', {
        items: items.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: form,
        paymentMethod: form.paymentMethod,
      });
      clearCart();
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to place your order.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f2ea] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black text-stone-900">Checkout</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-stone-700">Full name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-stone-700">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Payment method</label>
                <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3">
                  <option>Cash on Delivery</option>
                  <option>GCash</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
            </div>

            {message ? <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</div> : null}
            <button type="submit" disabled={saving} className="mt-6 w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white disabled:opacity-70">
              {saving ? 'Placing order...' : 'Place order'}
            </button>
          </form>

          <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-stone-900">Your order</h2>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3 rounded-2xl border border-stone-200 p-3">
                  <img src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-stone-900">₱{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between"><span>Subtotal</span><span>₱{subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₱{shipping}</span></div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-900"><span>Total</span><span>₱{total}</span></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
