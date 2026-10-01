import { Heart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const fallbackProductImage = '/sample-stamp.png';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackProductImage;
          }}
          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <button className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-stone-700 shadow-sm transition hover:bg-white">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-emerald-700">
          <span>{product.category}</span>
          <span>{product.location}</span>
        </div>

        <div>
          <h3 className="line-clamp-2 text-lg font-semibold text-stone-900">{product.name}</h3>
          <p className="mt-2 text-sm text-stone-600">{product.description}</p>
        </div>

        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-sm font-semibold text-stone-700">{product.rating}</span>
          <span className="text-xs text-stone-500">({product.reviews} reviews)</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-black text-stone-900">₱{product.price}</p>
            {product.oldPrice ? <p className="text-sm text-stone-400 line-through">₱{product.oldPrice}</p> : null}
          </div>
          <button
            onClick={() => addToCart(product, 1)}
            className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
