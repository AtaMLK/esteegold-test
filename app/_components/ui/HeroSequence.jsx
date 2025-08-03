"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSequence() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".panel");

      panels.forEach((panel, index) => {
        const heading = panel.querySelector(".hero-heading");
        const subtext = panel.querySelector(".hero-subtext");
        const blur = panel.querySelector(".blur-overlay");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top top",
            end: "+=200%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        if (index === 0) {
          // Panel 1: blur right half + text slides in from right
          tl.fromTo(
            blur,
            { width: "0%" },
            { width: "50%", duration: 1, ease: "power2.inOut" }
          )
            .fromTo(
              [heading, subtext],
              { x: "100%", autoAlpha: 0 },
              { x: "0%", autoAlpha: 1, stagger: 0.1, duration: 1 },
              "<"
            )
            .to(
              [heading, subtext],
              { x: "50%", autoAlpha: 0, duration: 1 },
              "+=0.5"
            )
            .to(blur, { width: "0%", duration: 1 }, "<");
        } else if (index === 1) {
          // Panel 2: whole panel slides in from left + text from left
          tl.fromTo(panel, { x: "-100%" }, { x: "0%", duration: 1 })
            .fromTo(
              [heading, subtext],
              { x: "-100%", autoAlpha: 0 },
              { x: "0%", autoAlpha: 1, stagger: 0.1, duration: 1 },
              "<"
            )
            .to(
              [heading, subtext],
              { x: "-50%", autoAlpha: 0, duration: 1 },
              "+=0.5"
            );
        } else if (index === 2) {
          // Panel 3: circular center blur + fade-in text
          tl.fromTo(
            blur,
            { clipPath: "circle(0% at 50% 50%)", opacity: 0.4 },
            { clipPath: "circle(50% at 50% 50%)", duration: 1 }
          )
            .fromTo(
              [heading, subtext],
              { scale: 0.8, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 1 },
              "<"
            )
            .to([heading, subtext], { autoAlpha: 0, duration: 1 }, "+=0.5")
            .to(
              blur,
              {
                clipPath: "circle(0% at 50% 50%)",
                duration: 1,
              },
              "<"
            );
        } else if (index === 3) {
          // Panel 4: full blur + text zooms out and shrinks
          tl.fromTo(blur, { opacity: 0 }, { opacity: 1, duration: 1 })
            .fromTo(
              [heading, subtext],
              { scale: 3, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 1 },
              "<"
            )
            .to(
              [heading, subtext],
              { scale: 0.5, autoAlpha: 0, duration: 1 },
              "+=0.5"
            )
            .to(blur, { opacity: 0, duration: 1 }, "<");
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* Panel 1: Right blur + text in from right */}
      <section
        className="panel h-screen relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/image1.jpg')" }}
      >
        <div className="blur-overlay absolute top-0 right-0 h-full bg-white/50 backdrop-blur-md z-10 transition-all" />
        <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="hero-heading text-black text-6xl font-extrabold uppercase">
            Discover the Silence
          </h1>
          <p className="hero-subtext mt-4 text-black text-2xl font-medium">
            Where every moment starts with clarity
          </p>
        </div>
      </section>

      {/* Panel 2: Slide from left + text from left */}
      <section
        className="panel h-screen relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/image2.jpg')" }}
      >
        <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="hero-heading text-black text-6xl font-extrabold uppercase">
            Step Into Focus
          </h1>
          <p className="hero-subtext mt-4 text-black text-2xl font-medium">
            Let your mind lead the way
          </p>
        </div>
      </section>

      {/* Panel 3: Circular blur + centered text */}
      <section
        className="panel h-screen relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/image3.jpg')" }}
      >
        <div className="blur-overlay absolute top-0 left-0 w-full h-full bg-white/40 backdrop-blur-md z-10" />
        <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="hero-heading text-black text-6xl font-extrabold uppercase">
            Breathe In Clarity
          </h1>
          <p className="hero-subtext mt-4 text-black text-2xl font-medium">
            Moments of stillness bloom from within
          </p>
        </div>
      </section>

      {/* Panel 4: Full blur + zoom/shrink text */}
      <section
        className="panel h-screen relative bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/image4.jpg')" }}
      >
        <div className="blur-overlay absolute top-0 left-0 w-full h-full bg-white/70 backdrop-blur-md z-10" />
        <div className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="hero-heading text-black text-6xl font-extrabold uppercase">
            Fade Into Flow
          </h1>
          <p className="hero-subtext mt-4 text-black text-2xl font-medium">
            And let go of everything else
          </p>
        </div>
      </section>
    </div>
  );
}
