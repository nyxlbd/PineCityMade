import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'pineCityCart';

const defaultCart = [];

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultCart;
    } catch (error) {
      return defaultCart;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item._id === product._id || item.id === product._id);

      if (existing) {
        return current.map((item) =>
          item._id === product._id || item.id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [
        ...current,
        {
          _id: product._id || product.id,
          name: product.name,
          price: Number(product.price || 0),
          image: product.image || product.images?.[0] || '',
          quantity,
          category: product.category || 'Local find',
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setItems((current) =>
      current
        .map((item) =>
          item._id === productId ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setItems((current) => current.filter((item) => item._id !== productId));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items],
  );

  const shipping = items.length ? 85 : 0;
  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      items,
      subtotal,
      shipping,
      total,
      itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
    }),
    [items, subtotal, shipping, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }

  return context;
};
