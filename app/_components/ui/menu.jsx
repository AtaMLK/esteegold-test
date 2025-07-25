"use client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { name: "Home", url: "/", src: "imagee-1.jpg" },
  { name: "Product", url: "/product", src: "imagee-2.jpg" },
  { name: "Contact", url: "/contact", src: "imagee-3.jpg" },
  { name: "About", url: "/about", src: "imagee-4.jpg" },
];

function Menu() {
  const [itemHover, setItemHover] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(menuItems[0].src); // Default image
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            className="overlay grid grid-cols-2"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Menu;
