"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/cartContext";
import { useUser } from "../../context/userContext";
import Menu from "./menu";

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => { setSearchOpen(false); setQuery(""); }, [pathname]);
  const accountHref = user ? "/profile" : `/auth/login?next=${encodeURIComponent("/profile")}`;

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function submitSearch(event) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    window.location.assign(`/categories?search=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <header className={pathname === "/" ? "header-container-absolute" : "header-container-flex"}>
        <div className="header-wrapper">
          <div className="header-logo"><Link href="/" aria-label="EsteeHouse home">EsteeHouse <span>EST. / HANDMADE</span></Link></div>
          <div className="header-icons">
            <button type="button" className={`search-trigger ${searchOpen ? "active" : ""}`} onClick={() => setSearchOpen(true)} aria-label="Open search"><span>Search</span><Search size={17} /></button>
            <Link href="/cart" aria-label={`Shopping bag, ${itemCount} items`} className="header-bag-link"><ShoppingBag className="header-icon" size={18} /><span>BAG</span><span className="header-bag-count">{itemCount}</span></Link>
            <Link href={accountHref} aria-label={user ? "Open account" : "Sign in"}><span className={`header-user ${user ? "is-signed-in" : ""}`}><User size={18} /></span></Link>
          </div>
        </div>
        <div className="header-menu"><Menu /></div>
      </header>
      <div className={`search-command ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-command-inner">
          <div className="search-command-top"><span>SEARCH / ESTEEHOUSE</span><button type="button" onClick={closeSearch}><X size={18} /> Close</button></div>
          <form onSubmit={submitSearch} className="search-command-input">
            <Search size={26} aria-hidden="true" />
            <input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a piece, collection or material…" aria-label="Search EsteeHouse" />
            {query ? <button type="submit" aria-label={`Search for ${query}`}><span>Search</span></button> : <span>⌘ K</span>}
          </form>
          <div className="search-command-results">{query ? <button type="button" className="search-result-link" onClick={submitSearch}><span>COLLECTION</span><strong>Search “{query}”</strong><span>↗</span></button> : <p className="search-command-hint">Explore EsteeGold, EsteeBags and the complete collection.</p>}</div>
        </div>
      </div>
    </>
  );
}
