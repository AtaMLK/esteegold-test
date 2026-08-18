"use client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeItemIndicator = gsap.utils.toArray(
        ".menu-item p#active::after"
      );

      gsap.set(".menu-item p", { y: 225 });
      const timeLine = gsap.timeline({ paused: true });

      timeLine.to(".overlay", {
        clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
        duration: 0,
      });
      timeLine.to(".overlay", {
        duration: 1,
        clipPath: "polygon(100% 0, 0% 0%, 0% 100%, 100% 100%)",
        ease: "power2.inOut",
      });

      timeLine.to(
        ".menu-item p",
        {
          duration: 1,
          y: 0,
          stagger: 0.2,
          ease: "power4.inOut",
        },
        "-=0.5"
      );

      timeLine.to(
        activeItemIndicator,
        {
          width: "100%",
          duration: 1,
          ease: "power4.out",
        },
        "<"
      );

      timeLine.to(
        ".sub-nav",
        {
          bottom: "07%",
          left: "58%",
          opacity: 1,
          duration: 1,
        },
        "<"
      );

      if (isOpen) {
        timeLine.invalidate().play();
      } else {
        timeLine.reverse();
      }

      return () => timeLine.kill();
    }
  }, [isOpen]);

  function handleClick() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        className={`burger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span></span>
      </button>
      <div className={`overlay ${isOpen ? "grid grid-cols-2 " : "hidden"}`}>
        <div className="overlay-content col-span-1">
          <div className="overlay-menu">
            <div className="menu-item">
              <ul>
                {menuItems.map((item, index) => (
                  <Link
                    href={item.url}
                    key={index}
                    onClick={handleClick}
                    onMouseEnter={() => {
                      setItemHover(true);
                      setActiveImage(item.src);
                    }}
                    onMouseLeave={() => setItemHover(false)}
                  >
                    <h1 id={`${itemHover ? "active" : ""}`}>{item.name}</h1>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
          <div className="sub-nav">
            <Link href="#" onClick={handleClick}>
              <p>Twitter</p>
            </Link>
            {instagramUrl ? (
              <a href={instagramUrl} target="_blank" rel="noreferrer" onClick={handleClick}>
                <p>Instagram</p>
              </a>
            ) : (
              <button type="button" onClick={handleClick} disabled>
                <p>Instagram</p>
              </button>
            )}
            <Link href="#" onClick={handleClick}>
              <p>Facebook</p>
            </Link>
          </div>
        </div>
        <div className="overlay-bg">
          <img
            src={`/images/Gallery/${activeImage}`}
            alt={activeImage}
            className="overlay-image"
          />
        </div>
      </div>
    </>
  );
}

export default Menu;
