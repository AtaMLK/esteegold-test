"use client";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

function Hero() {
  const heroRef = useRef(null);
  const img1 = useRef(null);
  const img2 = useRef(null);
  const img3 = useRef(null);
  const img4 = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      const tl = gsap.timeline();

      gsap.set(heroRef.current, { opacity: 0 }); // Appear from top-left
      gsap.set(img1.current, { opacity: 0, scale: 0, x: -200, y: -200 }); // Appear from top-left
      gsap.set(img2.current, { opacity: 0, scale: 0.5, x: 200, y: -300 }); // Appear from top-right
      gsap.set(img3.current, { opacity: 0, scale: 0.7, x: -300, y: 300 }); // Appear from bottom-left
      gsap.set(img4.current, { opacity: 0, scale: 0.3, x: 400, y: 400 }); // Appear from bottom-right

      tl.to(heroRef.current, {
        opacity: 1,
        duration: 4,
        ease: "power4.inOut",
      })
        .to(img1.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          img2.current,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.inOut",
          },
          "+=0.5"
        )
        .to(
          img3.current,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "power4.inOut",
          },
          "+=0.5"
        )
        .to(
          img4.current,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power4.inOut",
          },
          "+=0.5"
        );
    }
  }, []);
  return (
    <div ref={heroRef} className="hero-container md:mb-[45rem]">
      <div className="hero-img absolute top-0 left-0" ref={img1}>
        <img
          src="/images/Hero-bg-1.jpg"
          alt="hero-img"
          className="object-cover w-0 md:w-screen h-0 md:h-screen z-5"
        />
      </div>
      <div className="hero-img absolute top-0 left-0" ref={img2}>
        <img
          src="/images/Hero-bg-2.jpg"
          alt="hero-img"
          className="object-cover w-0 md:w-screen h-0 md:h-screen z-10"
        />
      </div>
      <div className="hero-img absolute top-0 right-0" ref={img3}>
        <img
          src="/images/Hero-bg-3.jpg"
          alt="hero-img"
          className="object-cover w-0 md:w-screen h-0 md:h-screen z-20"
        />
      </div>
      <div className="hero-img absolute top-0 right-0" ref={img4}>
        <img
          src="/images/Hero-bg-4.jpg"
          alt="hero-img"
          className="object-cover w-0 md:w-screen h-0 md:h-screen z-30"
        />
      </div>
      <div className="hero-content">
        <p>Wear your lovely pet</p>
        <Button
          variant="default"
          className="border-[1px] border-lightgreen-800 p-5 font-semibold text-md text-darkgreen-800 bg-lightgreen-400 mt-5"
        >
          Take a tour
        </Button>
      </div>
    </div>
  );
}

export default Hero;

/*  // Use just one static cursor image for debugging
  const cursorImage = "/images/cursor/cursor1.png";

  const [cursor, setCursor] = useState("auto");

  function handleMouseOver() {
    // Preload the cursor image
    const img = new Image();
    img.src = "/images/cursor/cursor1.png";
    // When the image is successfully loaded, update the cursor
    img.onload = () => {
      setCursor(`url(${cursorImage}) 16 16, auto`); // Apply the cursor style with the image
    };
  }

  function handleMouseOut() {
    setCursor("auto"); // Reset to default cursor when mouse leaves
  } */

/* onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseOut}
      style={{ cursor }} // Apply the cursor style to the entire div */
