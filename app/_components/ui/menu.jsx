"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./special-menu.css";

const menuItems = [
  { name: "EsteeGold", url: "/gold", src: "imagee-1.jpg", number: "01" },
  { name: "EsteeBags", url: "/bags", src: "imagee-2.jpg", number: "02" },
  { name: "Collection", url: "/categories", src: "imagee-3.jpg", number: "03" },
  { name: "About", url: "/about", src: "imagee-4.jpg", number: "04" },
  { name: "Contact", url: "/contact", src: "imagee-1.jpg", number: "05" },
];

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(menuItems[0]);
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { window.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <button type="button" className={`burger ${isOpen ? "active" : ""}`} onClick={() => setIsOpen((v) => !v)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}><span /></button>
      <div className={`special-menu-overlay ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
        <div className="special-menu-inner">
          <nav className="special-menu-list" aria-label="Main navigation">
            <div className="special-menu-label"><span>ESTEEHOUSE</span><span>MENU / 2026</span></div>
            <div className="special-menu-links">
              {menuItems.map((item) => <Link key={item.url} href={item.url} className={`special-menu-item ${active.url === item.url ? "is-active" : ""}`} onMouseEnter={() => setActive(item)} onFocus={() => setActive(item)} onClick={() => setIsOpen(false)}><span>{item.number}</span><h2>{item.name}</h2><span className="menu-arrow">↗</span></Link>)}
            </div>
            <div className="special-menu-bottom"><span>Two collections. One house.</span><div>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a> : <span>Instagram</span>}<span> / EsteeHouse</span></div></div>
          </nav>
          <div className="special-menu-visual" data-shape={active.number}>
            <div className="visual-aurora aurora-one" /><div className="visual-aurora aurora-two" /><div className="visual-aurora aurora-three" />
            <div className="special-menu-image-wrap"><div className="visual-ring" /><img src={`/images/Gallery/${active.src}`} alt="" /></div>
            <div className="special-menu-caption"><span>{active.number}</span><strong>{active.name}</strong><span>Move to explore</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
