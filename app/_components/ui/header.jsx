"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/cartContext";
import Menu from "./menu";

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setSearchOpen(false);
    setQuery("");
  }, [pathname]);

  return (
    <>
      <header className={pathname === "/" ? "header-container-absolute" : "header-container-flex"}>
        <div className="header-wrapper">
          <div className="header-logo">
            <Link href="/" aria-label="EsteeHouse home">EsteeHouse <span>EST. / HANDMADE</span></Link>
          </div>

          <div className="header-icons">
            <button className={`search-trigger ${searchOpen ? "active" : ""}`} onClick={() => setSearchOpen(true)} aria-label="Open search">
              <span>Search</span><Search size={17} />
            </button>
            <Link href="/cart" aria-label={`Shopping bag, ${itemCount} items`} className="header-bag-link">
              <ShoppingBag className="header-icon" size={18} />
              <span>BAG</span>
              <span className="header-bag-count">{itemCount}</span>
            </Link>
            <Link href="/profile" aria-label="Account"><span className="header-user"><User size={18} /></span></Link>
          </div>
        </div>
        <div className="header-menu"><Menu /></div>
      </header>

      <div className={`search-command ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-command-inner">
          <div className="search-command-top"><span>SEARCH / ESTEEHOUSE</span><button onClick={() => { setSearchOpen(false); setQuery(""); }}><X size={18} /> Close</button></div>
          <div className="search-command-input"><Search size={26} /><input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a piece, collection or material…" /><span>{query ? "Search" : "⌘ K"}</span></div>
          <div className="search-command-results">
            {query ? <Link href={`/categories?search=${encodeURIComponent(query)}`} onClick={() => setSearchOpen(false)}><span>COLLECTION</span><strong>Search “{query}”</strong><span>↗</span></Link> : <p className="search-command-hint">Explore EsteeGold, EsteeBags and the complete collection.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
