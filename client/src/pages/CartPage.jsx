import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, updateQuantity, removeFromCart, itemCount } = useCart();

  if (!items.length) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f2ea] px-4 py-10">
        <div className="w-full max-w-xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-3xl font-black text-stone-900">Your cart is empty</h1>
          <p className="mt-3 text-stone-600">Browse local favorites and add a few Baguio-made picks to get started.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-emerald-700 px-5 py-3 font-semibold text-white">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f2ea] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Cart</p>
            <h1 className="mt-2 text-3xl font-black text-stone-900">{itemCount} item(s) selected</h1>
          </div>
          <Link to="/" className="text-sm font-semibold text-emerald-700">Continue shopping</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col gap-4 rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <img src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'} alt={item.name} className="h-28 w-full rounded-2xl object-cover sm:w-28" />
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-stone-900">{item.name}</h2>
                      <p className="text-sm text-stone-500">{item.category}</p>
                    </div>
                    <p className="text-xl font-black text-stone-900">₱{item.price}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full border border-stone-300 bg-stone-50 px-2 py-1">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="rounded-full p-1.5 hover:bg-stone-200">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="rounded-full p-1.5 hover:bg-stone-200">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item._id)} className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-stone-900">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₱{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₱{shipping}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-bold text-stone-900">
                <span>Total</span>
                <span>₱{total}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="mt-6 w-full rounded-full bg-emerald-700 px-4 py-3 font-semibold text-white">
              Proceed to checkout
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
