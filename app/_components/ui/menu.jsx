"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { name: "Home", url: "/", src: "imagee-1.jpg", number: "01" },
  { name: "Product", url: "/product", src: "imagee-2.jpg", number: "02" },
  { name: "Contact", url: "/contact", src: "imagee-3.jpg", number: "03" },
  { name: "About", url: "/about", src: "imagee-4.jpg", number: "04" },
];

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(menuItems[0]);
  const overlayRef = useRef(null);
  const imageRef = useRef(null);
  const itemRefs = useRef([]);
  const timelineRef = useRef(null);
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { clipPath: "circle(0% at calc(100% - 34px) 34px)" });
      gsap.set(itemRefs.current, { y: 70, opacity: 0 });
      timelineRef.current = gsap.timeline({ paused: true })
        .to(overlayRef.current, { clipPath: "circle(150% at calc(100% - 34px) 34px)", duration: .9, ease: "power4.inOut" })
        .to(itemRefs.current, { y: 0, opacity: 1, stagger: .09, duration: .7, ease: "power4.out" }, "-=.45");
    });
    return () => { timelineRef.current?.kill(); ctx.revert(); };
  }, []);

  useEffect(() => {
    if (!timelineRef.current) return;
    if (isOpen) timelineRef.current.play(); else timelineRef.current.reverse();
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleHover = (item) => {
    setActive(item);
    if (imageRef.current) gsap.fromTo(imageRef.current, { opacity: .35, scale: 1.06, y: 14 }, { opacity: 1, scale: 1, y: 0, duration: .45, ease: "power3.out" });
  };

  return (
    <>
      <button className={`burger ${isOpen ? "active" : ""}`} onClick={() => setIsOpen((value) => !value)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}><span /></button>
      <div ref={overlayRef} className="special-menu-overlay">
        <div className="special-menu-inner">
          <div className="special-menu-list">
            <div className="special-menu-label"><span>ESTEE GOLD STUDIO</span><span>MENU / 2026</span></div>
            {menuItems.map((item, index) => (
              <Link key={item.url} href={item.url} ref={(node) => (itemRefs.current[index] = node)} className="special-menu-item" onMouseEnter={() => handleHover(item)} onClick={() => setIsOpen(false)}>
                <span>{item.number}</span><h2>{item.name}</h2><span>↗</span>
              </Link>
            ))}
            <div className="special-menu-bottom"><span>Explore slowly. Choose intentionally.</span><div>{instagramUrl ? <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a> : <span>Instagram</span>}<span> / Collection 2026</span></div></div>
          </div>
          <div className="special-menu-visual"><div className="special-menu-image-wrap"><img ref={imageRef} src={`/images/Gallery/${active.src}`} alt="" /></div><div className="special-menu-caption"><span>{active.number}</span><strong>{active.name}</strong><span>Hover to transform</span></div></div>
        </div>
      </div>
    </>
  );
}
