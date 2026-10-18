"use client";

import { useAppearance } from "./appearanceContext";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./userContext";
import { toast } from "@/hooks/use-toast";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { translateText, href } = useAppearance();
  const { user, authLoading } = useUser();
  const router = useRouter();
  const [saved, setSaved] = useState({ owner: null, ids: [] });
  const owner = user?.id || null;
  const ids = useMemo(() => owner && saved.owner === owner ? saved.ids : [], [owner, saved]);
  useEffect(() => {
    if (!owner) { setSaved({ owner: null, ids: [] }); return; }
    let restored = [];
    try {
      const stored = JSON.parse(localStorage.getItem("esteehouse-wishlist:" + owner) || "[]");
      if (Array.isArray(stored)) restored = stored.map(String);
    } catch {}
    setSaved({ owner, ids: restored });
  }, [owner]);
  useEffect(() => {
    if (!owner || saved.owner !== owner) return;
    try { localStorage.setItem("esteehouse-wishlist:" + owner, JSON.stringify(saved.ids)); } catch {}
  }, [saved, owner]);
  const value = useMemo(() => ({
    ids,
    count: ids.length,
    has: (id) => ids.includes(String(id)),
    toggle: (id) => {
      if (authLoading) return;
      if (!user) {
        toast({ title: translateText("Sign in to save your favourites"), description: translateText("Your saved pieces belong to your account on this device.") });
        router.push(href("/auth/login?next=" + encodeURIComponent(window.location.pathname + window.location.search)));
        return;
      }
      const removing = ids.includes(String(id));
      setSaved({ owner, ids: removing ? ids.filter((item) => item !== String(id)) : [...ids, String(id)] });
      toast({ title: removing ? translateText("Removed from saved pieces") : translateText("Saved for you") });
    },
    clear: () => { if (owner) { setSaved({ owner, ids: [] }); toast({ title: translateText("Saved list cleared") }); } },
  }), [ids, owner, user, authLoading, router, translateText, href]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used inside WishlistProvider");
  return context;
}
