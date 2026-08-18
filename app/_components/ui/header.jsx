"use client";

import "@/styles/styles.css";
import { ArrowUpRight, LucideShoppingBag, Search, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Menu from "./menu";
import { useAuthStore } from "@/app/_lib/authStore";
import { useProductStore } from "@/app/_lib/ProductStore";
import { supabase } from "@/app/_lib/supabase";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => useAuthStore.getState().setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, [fetchUser]);

  useEffect(() => {
    if (searchOpen && !products.length) fetchProducts();
  }, [searchOpen, products.length, fetchProducts]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return products.filter((product) => `${product.name || ""} ${product.categories?.title || ""}`.toLowerCase().includes(term)).slice(0, 5);
  }, [products, query]);

  const authPathname = ["/login", "/register"];
  const userName = user?.user_metadata?.name || user?.email || "";

  return (
    <>
      <header className={pathname === "/" ? "header-container-absolute" : "header-container-flex"}>
        <div className="header-wrapper">
          <div className="header-logo"><Link href="/" aria-label="Estee Gold Studio home">Estee <span>Gold</span> Studio</Link></div>
          {!authPathname.includes(pathname) && (
            <div className="header-icons">
              <button className={`search-trigger ${searchOpen ? "active" : ""}`} onClick={() => setSearchOpen(true)} aria-label="Open search"><span>Search the collection</span><Search size={17} /></button>
              <Link href="/cart" aria-label="Shopping bag"><LucideShoppingBag className="header-icon" size={19} /></Link>
              <Link href={user ? "/dashboard" : "/login"} aria-label={user ? "Account" : "Login"}><span className="header-user">{userName ? `Welcome, ${userName}` : <User size={19} />}</span></Link>
            </div>
          )}
        </div>
        <div className="header-menu"><Menu /></div>
      </header>

      <div className={`search-command ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-command-inner">
          <div className="search-command-top"><span>SEARCH / 2026</span><button onClick={() => { setSearchOpen(false); setQuery(""); }}><X size={18} /> Close</button></div>
          <div className="search-command-input"><Search size={26} /><input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a piece, category or material…" /><span>{query ? `${results.length} results` : "⌘ K"}</span></div>
          <div className="search-command-results">
            {!query ? <p className="search-command-hint">Start typing to search the collection.</p> : results.length ? results.map((product) => <Link key={product.id} href={`/product/${product.id}`} onClick={() => setSearchOpen(false)}><span>{product.categories?.title || "OBJECT"}</span><strong>{product.name}</strong><ArrowUpRight size={16} /></Link>) : <p className="search-command-hint">Nothing matched that search.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
