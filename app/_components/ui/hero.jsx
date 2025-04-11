"use client";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const images = [0, 1, 2, 3];
const transitionDuration = 5; // Time each image stays before transition

function Hero() {
  const heroRef = useRef(null);
  const imgRefs = useRef([]);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });

    images.forEach((_, index) => {
      tl.to(imgRefs.current[index], {
        zIndex: 1,
        opacity: 1,
        duration: 0.2,
        ease: "power3.inOut",
        onStart: () => {
          setActiveIndex(index);
          gsap.to(progressBarRef.current, {
            width: "120%",
            duration: transitionDuration,
            ease: "linear",
          });
        },
      })
        .to(
          imgRefs.current[index],
          {
            duration: 1,
            ease: "power3.inOut",
          },
          `+=${transitionDuration - 1}`
        )
        .set(progressBarRef.current, { width: "0%" }); // Reset progress bar
    });
  }, []);

  // Calculate content positions dynamically
  const containerPadding = 5 * 16; // 5rem in pixels
  const sectionWidth = (window.innerWidth - 2 * containerPadding) / 4;

  const contentPositions = [
    { left: `${containerPadding}px ` }, // First section
    { left: `${containerPadding + sectionWidth}px` }, // Second section
    { left: `${containerPadding + sectionWidth * 2}px ` }, // Third section
    { left: ` ${containerPadding + sectionWidth * 3}px -10px` }, // Fourth section
  ];

  return (
    <div
      ref={heroRef}
      className="relative hero-container md:mb-[45rem] overflow-hidden"
    >
      {images.map((_, index) => (
        <div
          key={index}
          ref={(el) => (imgRefs.current[index] = el)}
          className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-500"
          style={{ zIndex: index === activeIndex ? 2 : 0 }}
        >
          <img
            src={`/images/Hero-bg-${index + 1}.jpg`}
            alt="hero-img"
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      ))}

      {/* Static Content that moves to different positions based on active image */}
      <div
        ref={contentRef}
        className="hero-content absolute bottom-10 text-center bg-trasnparent p-4 rounded-lg "
        style={{ position: "absolute", ...contentPositions[activeIndex] }}
      >
        <p className="text-lg font-normal text-gray-700">
          Wear your lovely pet
        </p>

        {/* Progress Bar */}
        <div className="relative w-full h-[3px] bg-lightgreen-500 mt-2 overflow-hidden rounded-full">
          <div
            ref={progressBarRef}
            className="absolute left-0 top-0 h-full bg-darkgreen-600"
            style={{ width: "0%" }}
          />
        </div>

        <Button variant="outline" className="hero-button mt-3">
          Discover the beyond
        </Button>
      </div>
    </div>
  );
}

export default Hero;
