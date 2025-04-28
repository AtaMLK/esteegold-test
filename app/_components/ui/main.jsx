"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import About from "./about";
import CardMainLeft from "./card-image-left";
import CardMainRight from "./card-image-right";
import Hero from "./hero";
import MiniSlider from "./MiniSlider";
import { useProducts } from "@/app/context/Productcontext";
import Spinner from "./Spinner";

gsap.registerPlugin(ScrollTrigger);

function Main() {
  const { products, loading } = useProducts();
  const mainRef = useRef(null);

  useEffect(() => {
    // Scroll to top on reload
    window.scrollTo(0, 0);

    let mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)", // Large screens
        isTablet: "(min-width: 768px) and (max-width: 1023px)", // Tablets
        isMobile: "(max-width: 767px)", // Phones
      },
      (context) => {
        let { isDesktop, isTablet, isMobile } = context.conditions;

        gsap.set(mainRef.current, {
          opacity: 0,
          y: isDesktop ? 50 : 0,
        });

        gsap.to(mainRef.current, {
          opacity: 1,
          y: 0,
          duration: isDesktop ? 1.5 : 0,
          ease: "power.out",
          scrollTrigger: {
            trigger: mainRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
            immediateRender: false,
          },
        });
      }
    );
    return () => mm.revert(); // Cleanup GSAP media queries on unmount
  }, []);
  if (loading) return <Spinner />;
  return (
    <div className="mainpage-container" ref={mainRef} style={{ opacity: 0 }}>
      <Hero />
      <MiniSlider />
      <div className="card-section my-20">
        <Link href="/product">
          <CardMainLeft file="Product" />
        </Link>
        <Link href="/gallery">
          <CardMainRight file="Gallery" />
        </Link>
      </div>
      <About />
    </div>
  );
}
export default Main;
