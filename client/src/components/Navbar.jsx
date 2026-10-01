import { Menu, Search, ShoppingCart, UserCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-[#fffaf2]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-lg font-bold text-white shadow-sm">
            P
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">Baguio</p>
            <h1 className="text-xl font-black tracking-tight text-stone-900">Pine City Made</h1>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <div className="flex w-full max-w-xl items-center gap-2 overflow-hidden rounded-full border border-emerald-900/10 bg-white px-3 shadow-sm">
            <Search className="h-4 w-4 text-stone-500" />
            <input
              className="w-full border-0 bg-transparent py-3 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none"
              type="text"
              placeholder="Search local finds, coffee, crafts..."
            />
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stone-700 lg:flex">
          <a href="#categories">Categories</a>
          <a href="#featured">Featured</a>
          <a href="#sellers">Sellers</a>
          <a href="#about">About</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="hidden items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 sm:inline-flex">
                <UserCircle2 className="h-4 w-4" />
                {user.name}
              </Link>
              <button onClick={logout} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hidden items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 sm:inline-flex">
              <UserCircle2 className="h-4 w-4" />
              Login / Register
            </Link>
          )}
          <Link to="/cart" className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800">
            <ShoppingCart className="h-4 w-4" />
            Cart ({itemCount})
          </Link>
          <button className="inline-flex rounded-full border border-stone-300 p-2 text-stone-700 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
