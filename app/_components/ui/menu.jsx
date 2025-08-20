"use client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const menuItems = [
  { name: "Home", url: "/", src: "imagee-1.jpg" },
  { name: "Product", url: "/product", src: "imagee-2.jpg" },
  { name: "Contact", url: "/contact", src: "imagee-3.jpg" },
  { name: "About", url: "/about", src: "imagee-4.jpg" },
];

function Menu() {
  const [itemHover, setItemHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(menuItems[0].src);

  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  menuItemsRef.current = [];

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  function handleClick() {
    setIsOpen(false);
  }

  const addToRefs = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const tl = gsap.timeline();
      tl.set(overlayRef.current, { x: "100%" });
      tl.to(overlayRef.current, {
        x: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });
      tl.fromTo(
        menuItemsRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.3"
      );
    } else {
      const tl = gsap.timeline();
      tl.to(menuItemsRef.current.reverse(), {
        y: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.in",
      });
      tl.to(overlayRef.current, {
        x: "100%",
        duration: 0.8,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <>
      <button
        className={`burger ${
          isOpen ? "active" : ""
        } fixed top-6 right-6 z-[100]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
      </button>

      <div
        ref={overlayRef}
        className="overlay grid grid-cols-2 fixed inset-0 z-50 bg-white translate-x-full"
      >
        <div className="overlay-content col-span-1">
          <div className="overlay-menu">
            <div className="menu-item">
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index} ref={addToRefs} className="opacity-0">
                    <Link
                      href={item.url}
                      onClick={handleClick}
                      onMouseEnter={() => {
                        setItemHover(true);
                        setActiveImage(item.src);
                      }}
                      onMouseLeave={() => setItemHover(false)}
                    >
                      <h1 id={`${itemHover ? "active" : ""}`}>{item.name}</h1>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="sub-nav">
            <Link href="#" onClick={handleClick}>
              <p>Twitter</p>
            </Link>
            <Link href={instagramUrl} target="_blank" onClick={handleClick}>
              <p>Instagram</p>
            </Link>
            <Link href="#" onClick={handleClick}>
              <p>Facebook</p>
            </Link>
          </div>
        </div>
        <div className="overlay-bg">
          <img
            src={`/images/Gallery/${activeImage}`}
            alt={`${activeImage}`}
            className="overlay-image"
          />
        </div>
      </div>
    </>
  );
}

export default Menu;
