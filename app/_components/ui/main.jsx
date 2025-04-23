"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Link from "next/link";
import { useEffect, useRef } from "react";
import About from "./about";
import CardMainLeft from "./card-image-left";
import CardMainRight from "./card-image-right";
import Hero from "./hero";
import MiniSlider from "./MiniSlider";

const categories = [
  {
    id: "1",
    title: "Rings",
    details: "rings are the best thing that",
    src: "/images/Products-page/Combinations.jpg",
    src2: "/images/Products-page/Earings-title.jpg",
    type: "old fashioned",
  },
  {
    id: "2",
    title: "Necklaces",
    details: "necklaces are the best thing that",
    src: "/images/Products-page/Wedding-ring.jpg",
    src2: "/images/Products-page/rings-title.jpg",
    price: "100 €",
    type: "minimalistic",
  },
  {
    id: "3",
    title: "Bracelets",
    details: "bracelets are the best thing that",
    src: "/images/Products-page/Earings-title.jpg",
    src2: "/images/Products-page/rings-title.jpg",
    price: "100 €",
    type: "modern",
  },
  {
    id: "4",
    title: "Rings",
    details: "rings are the best thing that",
    src: "/images/Products-page/rings-title.jpg",
    src2: "/images/Products-page/Earings-title.jpg",
    price: "100 €",
    type: "minimalistic",
  },
  {
    id: "5",
    title: "Necklaces",
    details: "necklaces are the best thing that",
    src: "/images/Products-page/hand Combinations.jpg",
    src2: "/images/Products-page/rings-title.jpg",
    price: "100 €",
    type: "minimalistic",
  },
  {
    id: "6",
    title: "earrings",
    details: "bracelets are the best thing that",
    src: "/images/Products-page/necklesses-title.jpg",
    src2: "/images/Products-page/Wedding-ring.jpg",
    price: "100 €",
    type: "realistic",
  },
];

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
          y: isDesktop ? 200 : /*  isTablet ? 100 : */ 0,
        });

        gsap.to(mainRef.current, {
          opacity: 1,
          y: 0,
          duration: isDesktop ? 1.5 : /* isTablet ? 1.2 : 1 */ 0,
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
