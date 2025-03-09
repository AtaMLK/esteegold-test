"use client";
import Link from "next/link";
import About from "./about";
import CardMainLeft from "./card-image-left";
import CardMainRight from "./card-image-right";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Hero from "./hero";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

function Main() {
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
          y: isDesktop ? 200 : isTablet ? 100 : 20,
        });

        gsap.to(mainRef.current, {
          opacity: 1,
          y: 0,
          duration: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
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

  return (
    <div className="mainpage-container" ref={mainRef} style={{ opacity: 0 }}>
        <Hero />
      <div className="card-section">
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
