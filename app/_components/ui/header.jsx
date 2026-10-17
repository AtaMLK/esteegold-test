"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/cartContext";
import { useUser } from "../../context/userContext";
import "./house-chrome.css";

const navigation = [
  { label: "Bags", href: "/bags", detail: "Knotted, woven, handmade", image: "/images/bags/bag1.jpg", tone: "#d5d8c6", caption: "A story in every knot." },
  { label: "Silver", href: "/silver", detail: "Form, reflection, character", image: "/images/Products-page/rings-title.jpg", tone: "#d6d9d7", caption: "A conversation with light." },
  { label: "The collection", href: "/categories", detail: "Find your piece", image: "/images/Gallery/menu2.jfif", tone: "#dfd3c2", caption: "Follow what catches your eye." },
  { label: "The house", href: "/about", detail: "Our point of view", image: "/images/Gallery/menu3.jfif", tone: "#c9cfbe", caption: "Different materials. One instinct." },
  { label: "Contact", href: "/contact", detail: "Start a conversation", image: "/images/Gallery/menu5.jpg", tone: "#dfc9b8", caption: "A note. A new beginning." },
];

function useDialog(dialogRef, open) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) { if (dialog.open) dialog.close(); return; }
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector("[data-initial-focus]")?.focus();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [dialogRef, open]);
}

function containDialogFocus(event) {
  if (event.key !== "Tab") return;
  const controls = Array.from(event.currentTarget.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), [tabindex='0']")).filter((element) => element.getClientRects().length > 0);
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const accountHref = user ? "/profile" : "/auth/login?next=%2Fprofile";
  useDialog(searchRef, searchOpen);
  useDialog(menuRef, menuOpen);

  useEffect(() => { setSearchOpen(false); setMenuOpen(false); setQuery(""); }, [pathname]);
  useEffect(() => {
    function onShortcut(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen((current) => !current);
      }
    }
    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    if (query.trim()) window.location.assign("/categories?search=" + encodeURIComponent(query.trim()));
  }

  return (
    <>
      <header className="house-header">
        <Link href="/" className="house-wordmark" aria-label="EsteeHouse home">EsteeHouse<span>Objects with character</span></Link>
        <nav className="house-header-nav" aria-label="Collections"><Link href="/bags" aria-current={pathname === "/bags" ? "page" : undefined}>Bags</Link><Link href="/silver" aria-current={pathname === "/silver" ? "page" : undefined}>Silver</Link><Link href="/about" aria-current={pathname === "/about" ? "page" : undefined}>The house</Link></nav>
        <div className="house-header-actions">
          <button type="button" aria-label="Search the collection" aria-haspopup="dialog" onClick={() => setSearchOpen(true)}><Search size={17} /></button>
          <Link href={accountHref} aria-label={user ? "Your account" : "Sign in"}><User size={17} /></Link>
          <Link href="/cart" aria-label={"Shopping bag, " + itemCount + " items"} className="house-bag"><ShoppingBag size={17} /><span>{itemCount}</span></Link>
          <button type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={19} /><span className="house-menu-label">Menu</span></button>
        </div>
      </header>
      <dialog ref={searchRef} className="house-search" aria-labelledby="house-search-title" onKeyDown={containDialogFocus} onCancel={() => setSearchOpen(false)} onClose={() => setSearchOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
        <div className="house-search-panel">
          <div className="house-dialog-top"><p id="house-search-title">Search / EsteeHouse</p><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={22} /></button></div>
          <form onSubmit={submitSearch}><label htmlFor="house-search-input">What catches your eye?</label><div className="house-search-field"><input id="house-search-input" data-initial-focus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="A piece, a texture, a material…" autoComplete="off" /><button type="submit" aria-label="Submit search"><ArrowUpRight size={26} /></button></div></form>
          <p className="house-search-hint">Handmade bags. Silver. Something entirely yours.</p>
          <span className="house-dialog-shortcut">Ctrl / ⌘ K to toggle · Escape to close</span>
        </div>
      </dialog>
      <dialog ref={menuRef} className="house-navigation" aria-labelledby="house-menu-title" onKeyDown={containDialogFocus} onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)}>
        <div className="house-dialog-top"><p id="house-menu-title">EsteeHouse / Explore</p><button type="button" data-initial-focus onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={24} /></button></div>
        <div className="house-navigation-content"><nav aria-label="Main navigation">{navigation.map((item, index) => <Link href={item.href} key={item.href} data-active={activeMenu === index ? "true" : undefined} aria-current={pathname === item.href ? "page" : undefined} onMouseEnter={() => setActiveMenu(index)} onFocus={() => setActiveMenu(index)} onClick={() => setMenuOpen(false)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><ArrowUpRight size={23} /><small>{item.detail}</small></Link>)}</nav><div className="house-navigation-visual" style={{ "--menu-tone": navigation[activeMenu].tone }} aria-hidden="true"><span className="menu-visual-index">{String(activeMenu + 1).padStart(2, "0")} / THE HOUSE</span><div className="house-navigation-echo">{navigation.map((item, index) => <Image key={item.href} src={item.image} alt="" fill sizes="40vw" className={activeMenu === index ? "is-active" : ""} />)}</div><div className="house-navigation-image">{navigation.map((item, index) => <Image key={item.href} src={item.image} alt="" fill sizes="(max-width: 700px) 80vw, 35vw" className={activeMenu === index ? "is-active" : ""} />)}</div><div className="menu-visual-caption"><span>{navigation[activeMenu].label}</span><p>{navigation[activeMenu].caption}</p></div></div></div>
        <div className="house-navigation-bottom"><Link href={accountHref} onClick={() => setMenuOpen(false)}>{user ? "Your account" : "Sign in"} <ArrowUpRight size={14} /></Link><Link href="/wishlist" onClick={() => setMenuOpen(false)}>Saved pieces <ArrowUpRight size={14} /></Link><span>Istanbul / 2026</span></div>
      </dialog>
    </>
  );
}
