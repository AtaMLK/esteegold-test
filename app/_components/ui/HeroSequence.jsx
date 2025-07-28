"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSequence() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel");
      const texts = gsap.utils.toArray(".hero-text");

      gsap.set(sections, { zIndex: (i) => sections.length - i });

      sections.forEach((section, index) => {
        const text = texts[index];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=100%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        });

        // تعریف موقعیت شروع متن و انیمیشن ورود و خروج متن
        tl.fromTo(
          text,
          {
            autoAlpha: 0,
            y: index === 0 ? 100 : 0,
            x: index === 1 ? -200 : index === 2 ? 200 : 0,
            scale: 1,
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            scale: index === 3 ? 1 : 1,
            duration: 1,
          }
        )
          .to(
            text,
            {
              autoAlpha: 0,
              y: index === 3 ? -50 : -100,
              scale: index === 3 ? 1.3 : 1,
              duration: 1,
            },
            "+=0.5"
          );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* تصویر اول و متن وسط */}
      <section
        className="panel h-screen relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image1.jpg')" }}
      >
        <h1 className="hero-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold">
          متن اول
        </h1>
      </section>

      {/* تصویر دوم و متن از چپ */}
      <section
        className="panel h-screen relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image2.jpg')" }}
      >
        <h1 className="hero-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold">
          متن دوم از چپ
        </h1>
      </section>

      {/* تصویر سوم و متن از راست */}
      <section
        className="panel h-screen relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image3.jpg')" }}
      >
        <h1 className="hero-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold">
          متن سوم از راست
        </h1>
      </section>

      {/* تصویر چهارم و متن زوم شونده وسط */}
      <section
        className="panel h-screen relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/image4.jpg')" }}
      >
        <h1 className="hero-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold">
          متن چهارم (زوم)
        </h1>
      </section>
    </div>
  );
}
