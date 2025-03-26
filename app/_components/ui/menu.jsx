"use client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useState } from "react";

const menuItems = [
  { name: "Home", url: "/", src: "image-1.jpg" },
  { name: "Product", url: "/product", src: "image-2.jpg" },
  { name: "Contact", url: "/contact", src: "image-3.jpg" },
  { name: "About", url: "/about", src: "image-4.jpg" },
];

function Menu() {
  const [itemHover, setItemHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(menuItems[0].src); // Default image
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      let activeItemIndicator = gsap.utils.toArray(
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
          ease: "power4.out" /* 
          delay: 0.5, */,
        },
        "<"
      );
      gsap.to(".sub-nav", {
        scale: 1.2,
        backgroundColor: "#333", // Adjust for a darker shade
        duration: 0.5,
        ease: "power2.out",
        paused: true,
      });
      timeLine.to(
        ".sub-nav",
        {
          bottom: "10%",
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
      >
        <span></span>
      </button>
      <div className={`overlay ${isOpen ? "grid grid-cols-2 " : "hidden"} `}>
        <div className="overlay-content col-span-1">
          <div className="overlay-menu ">
            <div className="menu-item ">
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
            <Link href={instagramUrl} target="_blank" onClick={handleClick}>
              <p>Instagram</p>
            </Link>
            <Link href="#" onClick={handleClick}>
              <p>Facebook</p>
            </Link>
          </div>
        </div>
        <div className="overlay-bg ">
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
