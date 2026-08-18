import { create } from "zustand";

const STORAGE_KEY = "estee-gold-cart";

const readCart = () => {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const persist = (items) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const useCartStore = create((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const items = readCart();
    set({ items, hydrated: true });
  },

  addItem: (product, quantity = 1) => {
    const items = [...get().items];
    const index = items.findIndex((item) => String(item.id) === String(product.id));
    const amount = Math.max(1, Number(quantity) || 1);

    if (index >= 0) {
      items[index] = { ...items[index], quantity: items[index].quantity + amount };
    } else {
      const image = product.product_images?.find((item) => item.is_primary)?.image_url
        || product.product_images?.[0]?.image_url
        || product.image_url
        || "/images/Hero-bg-1.jpg";

      items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        image,
        material: product.material || "",
        quantity: amount,
      });
    }

    persist(items);
    set({ items, hydrated: true });
  },

  removeItem: (id) => {
    const items = get().items.filter((item) => String(item.id) !== String(id));
    persist(items);
    set({ items });
  },

  setQuantity: (id, quantity) => {
    const amount = Math.max(0, Number(quantity) || 0);
    if (amount === 0) return get().removeItem(id);
    const items = get().items.map((item) =>
      String(item.id) === String(id) ? { ...item, quantity: amount } : item
    );
    persist(items);
    set({ items });
  },

  clearCart: () => {
    persist([]);
    set({ items: [] });
  },

  total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  count: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
}));
