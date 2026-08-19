"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { eyebrow: "01 / THE OBJECT", title: "Designed to be noticed.", text: "A quieter kind of luxury — precise forms, considered materials, and details that reward a closer look." },
  { eyebrow: "02 / THE FORM", title: "Shape becomes identity.", text: "We build each piece around proportion, movement, and the way it lives with you rather than simply sitting on you." },
  { eyebrow: "03 / THE DETAIL", title: "Small details. Long memory.", text: "From the first silhouette to the final finish, every surface is treated as part of the experience." },
  { eyebrow: "04 / THE COLLECTION", title: "Find the piece that feels like yours.", text: "Explore EsteeGold and EsteeBags — two collections, one house." },
];

const images = [
  "/images/Hero-bg-1.jpg",
  "/images/Hero-bg-2.jpg",
  "/images/Hero-bg-3.jpg",
  "/images/Hero-bg-4.jpg",
];

export default function Hero() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const modelRef = useRef(null);
  const imageRefs = useRef([]);
  const chapterRefs = useRef([]);
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const model = modelRef.current;
    if (!root || !stage || !model) return;

    const ctx = gsap.context(() => {
      gsap.set(imageRefs.current, { autoAlpha: 0, scale: 1.08, rotate: 2 });
      gsap.set(imageRefs.current[0], { autoAlpha: 1, scale: 1, rotate: 0 });
      gsap.set(chapterRefs.current, { autoAlpha: 0, y: 38 });
      gsap.set(chapterRefs.current[0], { autoAlpha: 1, y: 0 });
      gsap.set(model, { y: 25, scale: 0.92, rotateY: -7, rotateZ: -1.5 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, pin: stage, anticipatePin: 1 },
      });

      timeline.to(model, { y: -15, scale: 1.03, rotateY: 7, rotateZ: 1.5, duration: 1 });

      chapters.slice(1).forEach((_, index) => {
        const current = index;
        const next = index + 1;
        timeline
          .to(chapterRefs.current[current], { autoAlpha: 0, y: -38, duration: 0.2 })
          .to(chapterRefs.current[next], { autoAlpha: 1, y: 0, duration: 0.2 }, "<")
          .to(imageRefs.current[current], { autoAlpha: 0, scale: 1.08, rotate: -2, duration: 0.2 }, "<")
          .to(imageRefs.current[next], { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.2 }, "<")
          .to(model, { y: -35 - next * 8, rotateY: next % 2 ? -6 : 6, rotateZ: next % 2 ? -1.5 : 1.5, duration: 0.7 });
      });

      gsap.to(progressRef.current, { scaleY: 1, transformOrigin: "top center", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true } });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="hero-story">
      <div ref={stageRef} className="hero-stage">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-topline"><span>ESTEEHOUSE / 2026</span></div>
        <div className="hero-progress" aria-hidden="true"><span ref={progressRef} /></div>

        <div className="hero-copy">
          {chapters.map((chapter, index) => (
            <div key={chapter.eyebrow} ref={(node) => (chapterRefs.current[index] = node)} className="hero-chapter">
              <p className="hero-eyebrow">{chapter.eyebrow}</p>
              <h1>{chapter.title}</h1>
              <p className="hero-description">{chapter.text}</p>
              {index === chapters.length - 1 && <Link className="hero-cta" href="/categories">Explore collection <ArrowUpRight size={17} strokeWidth={1.7} /></Link>}
            </div>
          ))}
        </div>

        <div className="hero-model-wrap" aria-hidden="true">
          <div className="hero-model-ring ring-one" />
          <div className="hero-model-ring ring-two" />
          <div ref={modelRef} className="hero-model">
            {images.map((image, index) => <img key={image} ref={(node) => (imageRefs.current[index] = node)} src={image} alt="" className="hero-model-image" />)}
          </div>
          <div className="hero-model-shadow" />
        </div>

        <div className="hero-scroll-hint"><ArrowDown size={15} /><span>Scroll to discover</span></div>
        <div className="hero-index">SCROLL / 04</div>
      </div>
    </section>
  );
}
