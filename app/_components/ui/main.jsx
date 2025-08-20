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
    fetchProducts().then(() => {
      ScrollTrigger.refresh();
    });
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
