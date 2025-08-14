"use client";

import { useProductStore } from "@/app/_lib/ProductStore";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";
import { useEffect, useRef } from "react";
import About from "./about";
import CardMainLeft from "./card-image-left";
import CardMainRight from "./card-image-right";
import ParallaxSlider from "./Paralex Slider/ParalexSlider";
import HeroScroll from "./scroll header/HeroScroll";

gsap.registerPlugin(ScrollTrigger);

function Main() {
  const { fetchProducts } = useProductStore();
  const cardSectionRef = useRef(null);

  useEffect(() => {
    // Scroll to top on reload
    window.scrollTo(0, 0);

    // GSAP animation for card section (not whole page)
    gsap.from(cardSectionRef.current, {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardSectionRef.current,
        start: "top 85%",
        end: "top 40%",
        scrub: 1,
      },
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="mainpage-container">
      <HeroScroll />
      <ParallaxSlider />
      <div
        ref={cardSectionRef}
        className="card-section my-20 px-4 lg:px-16 xl:px-20"
      >
        <Link href="/product">
          <CardMainLeft file="Product" />
        </Link>
        <Link href="/custom_product">
          <CardMainRight file="Gallery" />
        </Link>
      </div>
      <About />
    </div>
  );
}

export default Main;
