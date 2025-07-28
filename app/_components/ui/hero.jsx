"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const images = [0, 1, 2, 3];

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".panel");

    gsap.to(sections, {
      yPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: `+=${window.innerHeight * sections.length}`,
      },
    });
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden">
      {images.map((_, index) => (
        <section
          key={index}
          className="panel w-full h-screen flex items-center justify-center"
        >
          <img
            src={`/images/Hero-bg-${index + 1}.jpg`}
            alt={`Hero ${index + 1}`}
            className="object-cover w-full h-full"
          />
        </section>
      ))}
    </div>
  );
}
