"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "esteehouse-wishlist";

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setIds(saved.map(String));
    } catch {} finally { setHydrated(true); }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch {}
  }, [ids, hydrated]);

  const value = useMemo(() => ({
    ids,
    count: ids.length,
    has: (id) => ids.includes(String(id)),
    toggle: (id) => setIds((current) => { const key = String(id); return current.includes(key) ? current.filter((item) => item !== key) : [...current, key]; }),
    clear: () => setIds([]),
  }), [ids]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
