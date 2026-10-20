"use client";

import { useAppearance } from "../../context/appearanceContext";

import Link from "./localized-link";
import AppearanceControls from "./appearance-controls";
import Image from "next/image";
import { unlocalizedPath } from "../../_lib/localization";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../../context/cartContext";
import { useUser } from "../../context/userContext";
import "./house-chrome.css";

function createNavigation(translateText) { return [
  { label: "EsteeBags", href: "/bags", detail: translateText("Handmade bags / Knots & character"), image: "/images/bags/bag1.jpg", tone: "#d5d8c6", caption: translateText("A story in every knot.") },
  { label: "EsteeGold", href: "/silver", detail: translateText("Handmade silver / Form & light"), image: "/images/Products-page/rings-title.jpg", tone: "#d6d9d7", caption: translateText("A conversation with light.") },
  { label: translateText("The collection"), href: "/categories", detail: translateText("Find your piece"), image: "/images/Gallery/menu2.jfif", tone: "#dfd3c2", caption: translateText("Follow what catches your eye.") },
  { label: translateText("The house"), href: "/about", detail: translateText("Our point of view"), image: "/images/Gallery/menu3.jfif", tone: "#c9cfbe", caption: translateText("Different materials. One instinct.") },
  { label: translateText("Contact"), href: "/contact", detail: translateText("Start a conversation"), image: "/images/Gallery/menu5.jpg", tone: "#dfc9b8", caption: translateText("A note. A new beginning.") },
 ]; }

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
  const { translateText, href } = useAppearance();
  const pathname = usePathname();
  const navigation = createNavigation(translateText);
  const { itemCount } = useCart();
  const { user } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
  const [previewMenu, setPreviewMenu] = useState(0);
  const loadedImages = useRef(new Set());
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);
  const menuRef = useRef(null);
  const accountHref = user ? "/profile" : "/auth/login?next=" + encodeURIComponent(href("/profile"));
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

  function previewNavigation(index) {
    setActiveMenu(index);
    if (loadedImages.current.has(index)) setPreviewMenu(index);
  }

  function menuImageLoaded(index) {
    loadedImages.current.add(index);
    if (activeMenu === index) setPreviewMenu(index);
  }

  function submitSearch(event) {
    event.preventDefault();
    if (query.trim()) window.location.assign(href("/categories?search=" + encodeURIComponent(query.trim())));
  }

  return (
    <>
      <header className="house-header">
        <Link href="/" className="house-wordmark" aria-label={translateText("EsteeHouse home")}>EsteeHouse<span>{translateText("Objects with character")}</span></Link>
        <div className="house-header-actions"><AppearanceControls/>
          <button type="button" aria-label={translateText("Search the collection")} aria-haspopup="dialog" onClick={() => setSearchOpen(true)}><Search size={17} /></button>
          <Link href={accountHref} className="house-header-account" aria-label={user ? translateText("Your account") : translateText("Sign in")}><User size={17} /></Link>
          <Link href="/cart" aria-label={translateText("Shopping bag", "Sepet") + ", " + itemCount + " " + translateText("items", "ürün")} className="house-bag"><ShoppingBag size={17} /><span>{itemCount}</span></Link>
          <button type="button" aria-label={translateText("Open navigation")} aria-haspopup="dialog" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}><Menu size={19} /><span className="house-menu-label">{translateText("Menu")}</span></button>
        </div>
      </header>
      <dialog ref={searchRef} className="house-search" aria-labelledby="house-search-title" onKeyDown={containDialogFocus} onCancel={() => setSearchOpen(false)} onClose={() => setSearchOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
        <div className="house-search-panel">
          <div className="house-dialog-top"><p id="house-search-title">{translateText("Search / EsteeHouse")}</p><button type="button" onClick={() => setSearchOpen(false)} aria-label={translateText("Close search")}><X size={22} /></button></div>
          <form onSubmit={submitSearch}><label htmlFor="house-search-input">{translateText("What catches your eye?")}</label><div className="house-search-field"><input id="house-search-input" data-initial-focus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={translateText("A piece, a texture, a material…")} autoComplete="off" /><button type="submit" aria-label={translateText("Submit search")}><ArrowUpRight size={26} /></button></div></form>
          <p className="house-search-hint">{translateText("Handmade bags. Silver. Something entirely yours.")}</p>
          <span className="house-dialog-shortcut">{translateText("Ctrl / ⌘ K to toggle · Escape to close")}</span>
        </div>
      </dialog>
      <dialog ref={menuRef} className="house-navigation" aria-labelledby="house-menu-title" onKeyDown={containDialogFocus} onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)}>
        <div className="house-dialog-top"><p id="house-menu-title">{translateText("EsteeHouse / Explore")}</p><button type="button" data-initial-focus onClick={() => setMenuOpen(false)} aria-label={translateText("Close navigation")}><X size={24} /></button></div>
        <div className="house-navigation-content"><div className="house-navigation-links"><nav aria-label={translateText("Main navigation")}>{navigation.map((item, index) => <Link href={item.href} key={item.href} data-active={activeMenu === index ? "true" : undefined} aria-current={unlocalizedPath(pathname) === item.href ? "page" : undefined} onMouseEnter={() => previewNavigation(index)} onFocus={() => previewNavigation(index)} onClick={() => setMenuOpen(false)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><ArrowUpRight size={23} /><small>{item.detail}</small></Link>)}</nav><div className="house-navigation-bottom"><Link href={accountHref} onClick={() => setMenuOpen(false)}>{user ? translateText("Your account") : translateText("Sign in")} <ArrowUpRight size={14} /></Link><Link href="/wishlist" onClick={() => setMenuOpen(false)}>{translateText("Saved pieces")}<ArrowUpRight size={14} /></Link></div></div><div className="house-navigation-visual" style={{ "--menu-tone": navigation[activeMenu].tone }} aria-hidden="true"><span className="menu-visual-index">{String(activeMenu + 1).padStart(2, "0")} / THE HOUSE</span><div className="house-navigation-artwork-slot"><div className="house-navigation-artwork"><div className="house-navigation-echo">{menuOpen && navigation.map((item, index) => <Image key={item.href} src={item.image} alt="" fill sizes="35vw" loading="eager" onLoad={() => menuImageLoaded(index)} className={previewMenu === index ? "is-active" : ""}/>)}</div><div className="house-navigation-image">{menuOpen && navigation.map((item, index) => <Image key={item.href} src={item.image} alt="" fill sizes="35vw" loading="eager" onLoad={() => menuImageLoaded(index)} className={previewMenu === index ? "is-active" : ""}/>)}</div></div></div><div className="menu-visual-caption"><span>{navigation[activeMenu].label}</span><p>{navigation[activeMenu].caption}</p></div></div></div>
      </dialog>
    </>
  );
}
