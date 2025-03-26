"use client";
import { Button } from "@/components/ui/button";
import { image } from "confetti/src/models";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const images = [0, 1, 2, 3];

function Hero() {
  const heroRef = useRef(null);
  const imgRefs = useRef([
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]);

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
        duration: 2.5,
        ease: "power4.inOut",
      })
        .to(img1.current, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        })
        .to(
          img2.current,
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 1,
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
            duration: 0.6,
            ease: "power4.inOut",
          },
          "+=0.5"
        );
    }
  }, []);
  return (
    <div ref={heroRef} className="hero-container md:mb-[45rem]">
      {images.map((img, index) => (
        <div
          className="hero-img absolute top-0 left-0"
          ref={imgRefs.current[index + 1]}
          key={index}
        >
          <img
            src={`/images/Hero-bg-${index + 1}.jpg`}
            alt="hero-img"
            className="object-cover w-0 md:w-screen h-0 md:h-screen z-10"
            loading="lazy"
          />
        </div>
      ))}

      <div className="hero-content">
        <p>Wear your lovely pet</p>
        <Button variant="default" className="hero-button">
          Discover the beyond
        </Button>
      </div>
    </div>
  );
}

export default Hero;
