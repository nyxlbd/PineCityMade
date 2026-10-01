export default function Footer() {
  return (
    <footer className="mt-20 border-t border-stone-200 bg-stone-900 text-stone-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
              P
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Made Local</p>
              <h3 className="text-lg font-bold text-white">Pine City Made</h3>
            </div>
          </div>
          <p className="text-sm text-stone-300">
            Bringing together Baguio’s makers, local flavors, and handcrafted stories in one trusted marketplace.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Marketplace</h4>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>Shop by category</li>
            <li>Featured sellers</li>
            <li>New arrivals</li>
            <li>Local favorites</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Support</h4>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>Shipping & delivery</li>
            <li>Returns</li>
            <li>Seller registration</li>
            <li>Customer care</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Visit Baguio</h4>
          <ul className="space-y-2 text-sm text-stone-300">
            <li>Local artisan hubs</li>
            <li>Pine market finds</li>
            <li>Mountain culture</li>
            <li>Community-made goods</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800 py-4 text-center text-sm text-stone-400">
        © 2026 Pine City Made. Made Local. Made in Pine City.
      </div>
    </footer>
  );
}
