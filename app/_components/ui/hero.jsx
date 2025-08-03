"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const images = [0, 1, 2, 3];

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const image2Ref = useRef(null);

  useEffect(() => {
    const sections = gsap.utils.toArray(".panel");

    // Scroll animation for full panels (duration ×2)
    gsap.to(sections, {
      yPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 2,
        snap: 1 / (sections.length - 1),
        end: `+=${window.innerHeight * sections.length * 2}`, // doubled duration
      },
    });

    // Image blur slide-in (from left to center, doubled duration)
    gsap.fromTo(
      image2Ref.current,
      { filter: "blur(40px)", x: "-50vw" },
      {
        filter: "blur(0px)",
        x: "0vw",
        ease: "power2.out",
        scrollTrigger: {
          trigger: image2Ref.current,
          start: "top center",
          end: "bottom center",
          scrub: 3, // slowed down blur
        },
      }
    );

    // Text fade-in and slide (centered, doubled duration)
    gsap.fromTo(
      textRef.current,
      { autoAlpha: 0, x: -100 },
      {
        autoAlpha: 1,
        x: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: image2Ref.current,
          start: "top center",
          end: "center center",
          scrub: 3,
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden">
      {images.map((_, index) => (
        <section
          key={index}
          className="panel w-full h-screen relative flex items-center justify-center"
        >
          <img
            ref={index === 1 ? image2Ref : null}
            src={`/images/Hero-bg-${index + 1}.jpg`}
            alt={`Hero ${index + 1}`}
            className="object-cover w-full h-full"
          />

          {index === 1 && (
            <div
              ref={textRef}
              className="absolute text-white text-4xl font-bold px-8 max-w-xl text-center"
              style={{ zIndex: 10 }}
            >
              Discover the Power of Precision
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
