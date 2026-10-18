"use client";

import { useAppearance } from "./appearanceContext";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "esteehouse-cart";
const CartContext = createContext(null);

function itemUnitPrice(item) {
  if (item.finalPrice != null) return Number(item.finalPrice);
  const price = Number(item.price || 0);
  const discount = Number(item.discount_percent || 0);
  return Math.max(0, price - price * discount / 100);
}

export function CartProvider({ children }) {
  const { translateText } = useAppearance();
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("esteehouse:cart-updated"));
  }, [items, ready]);

  const addItem = useCallback((product, quantity = 1, options = {}) => {
    if (items.length && items.some((item) => (item.currency || "EUR") !== (product.currency || "EUR"))) return;
    toast({ title: translateText("Added to your bag"), description: product.name });
    setItems((current) => {
      const key = `${product.id}:${JSON.stringify(options)}`;
      const existing = current.find((item) => item.key === key);
      if (current.length && current.some((item) => (item.currency || "EUR") !== (product.currency || "EUR"))) return current;
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { ...product, key, quantity, options }];
    });
  }, [items, translateText]);

  const updateQuantity = useCallback((key, quantity) => setItems((current) => current.map((item) => item.key === key ? { ...item, quantity: Math.max(1, quantity) } : item)), []);
  const removeItem = useCallback((key) => { const removed = items.find((item) => item.key === key); setItems((current) => current.filter((item) => item.key !== key)); if (removed) toast({ title: translateText("Removed from your bag"), description: removed.name }); }, [items, translateText]);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    ready,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    subtotal: items.reduce((sum, item) => sum + itemUnitPrice(item) * Number(item.quantity || 0), 0),
    unitPrice: itemUnitPrice,
  }), [items, ready, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
