"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { Mouse } from "lucide-react";
import Link from "next/link";
import "../product/product.css";

gsap.registerPlugin(ScrollTrigger);

function Product() {
  const mouseRef = useRef();
  useEffect(() => {
    // Scroll to top on reload
    window.scrollTo(0, 0);
    const items = document.querySelectorAll(".item-card");

    gsap.set(mouseRef.current, { opacity: 0.5 });

    // Blinking effect
    gsap.to(mouseRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // Fade out on scroll
    gsap.to(mouseRef.current, {
      opacity: 0,
      scrollTrigger: {
        trigger: "body",
        start: "top+=100", // Adjust this value to control when it disappears
        scrub: true,
      },
    });

    items.forEach((item) => {
      gsap.set(item, { opacity: 0.1, y: 100 });
      gsap.to(item, {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      });
    });
  }, []);

  // Example product list (you can fetch these later)
  const products = [
    {
      id: "1",
      title: "Rings",
      details: "rings are the best thing that",
      image: "/images/Products-page/Bracelets.jpg",
      // You may add more data as needed
    },
    {
      id: "2",
      title: "Combined styles",
      details: "perfect matches as a set",
      image: "/images/Products-page/Ring.jpg",
    },
    {
      id: "3",
      title: "Earrings",
      details: "a whisper onto your ears",
      image: "/images/Products-page/Combinations.jpg",
    },
    {
      id: "4",
      title: "Rings and Bracelets",
      details: "show your fist with a power",
      image: "/images/Products-page/Earrings.jpg",
    },
    {
      id: "5",
      title: "Earrings",
      details: "rings are the best thing that",
      image: "/images/Products-page/hand combinations.jpg",
    },
    {
      id: "6",
      title: "Rings",
      details: "rings are the best thing that",
      image: "/images/Products-page/Earrings-2.jpg",
    },
  ];

  const positions = ["20rem", "42rem", "70rem", "95rem", "130rem", "150rem"];

  return (
    <div className="products-container">
      <div className="mouse-icon" ref={mouseRef}>
        <Mouse />
      </div>
      <div className="products-items">
        {products.map((product, index) => (
          // Wrap each card in a Link to its detail page
          <Link href={`/product/${product.id}`} key={product.id}>
            <div
              className={`item-card ${
                // Optionally add your positioning classes based on index
                index % 2 === 0 ? "left-[15rem]" : "right-[13rem]"
              }  
             `}
              style={{ top: positions[index] }}
            >
              <div className="item-image">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  objectFit="cover"
                />
              </div>
              <div className="item-content">
                <h3 className="item-title">{product.title}</h3>
                <p className="item-details">{product.details}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Product;
