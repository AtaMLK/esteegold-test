"use client";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useState } from "react";

function Menu() {
  const [isOpen, setIsOpen] = useState(false);
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
          duration: 1 /* 
          delay: 1, */,
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

  function handleClick(){
    setIsOpen(false)
  }

  return (
    <>
      <button
        className={`burger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
      </button>
      <div className={`overlay ${isOpen ? "flex" : "hidden"}`}>
        <div className="overlay-menu ">
          <div className="menu-item ">
            <Link href="/" onClick={handleClick}>
              <h1 id="active">Home</h1>
            </Link>
            <Link href="/product" onClick={handleClick}>
              <h1>Product</h1>
            </Link>
            <Link href="/contact" onClick={handleClick}>
              <h1>Contact</h1>
            </Link>
            <Link href="/about" onClick={handleClick}>
              <h1>About</h1>
            </Link>
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
    </>
  );
}

export default Menu;
