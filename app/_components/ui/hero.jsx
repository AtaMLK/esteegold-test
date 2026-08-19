"use client";

import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, MoveRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import "./hero.css";

gsap.registerPlugin(ScrollTrigger);

const stories = {
  gold: [
    { eyebrow: "01 / ESTEEGOLD", title: "Designed to be noticed.", text: "A quieter kind of luxury — precise forms, considered materials, and details that reward a closer look." },
    { eyebrow: "02 / THE FORM", title: "Shape becomes identity.", text: "Jewelry built around proportion, movement and the way a piece lives with you." },
    { eyebrow: "03 / THE DETAIL", title: "Small details. Long memory.", text: "From the first silhouette to the final finish, every surface is treated as part of the experience." },
    { eyebrow: "04 / THE COLLECTION", title: "Find the piece that feels like yours.", text: "Explore EsteeGold and discover the objects behind the story." },
  ],
  bags: [
    { eyebrow: "01 / ESTEEBAGS", title: "Made to move with you.", text: "Handmade bags with texture, rhythm and a little more personality than expected." },
    { eyebrow: "02 / THE WEAVE", title: "The material stays visible.", text: "Knots, colour, tension and small irregularities become part of the design rather than something to hide." },
    { eyebrow: "03 / THE CHARACTER", title: "Every bag has its own rhythm.", text: "Built by hand, each piece carries the small differences that make handmade objects worth keeping." },
    { eyebrow: "04 / THE COLLECTION", title: "Carry something with character.", text: "Explore EsteeBags and find the colour, texture and form that feels like yours." },
  ],
};

const goldImages = ["/images/Hero-bg-1.jpg", "/images/Hero-bg-2.jpg", "/images/Hero-bg-3.jpg", "/images/Hero-bg-4.jpg"];
const bagImages = Array.from({ length: 20 }, (_, index) => `/images/bags/bag${index + 1}.jpg`);

export default function Hero() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const modelRef = useRef(null);
  const goldImageRefs = useRef([]);
  const bagImageRefs = useRef([]);
  const chapterRefs = useRef([]);
  const progressRef = useRef(null);
  const orbitRef = useRef(null);
  const [collection, setCollection] = useState("gold");
  const [chapter, setChapter] = useState(0);

  const activeImages = collection === "gold" ? goldImages : bagImages;
  const activeStory = stories[collection];

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const model = modelRef.current;
    if (!root || !stage || !model) return;

    const ctx = gsap.context(() => {
      const allChapterRefs = chapterRefs.current.filter(Boolean);
      const goldRefs = goldImageRefs.current.filter(Boolean);
      const bagRefs = bagImageRefs.current.filter(Boolean);
      gsap.set([...goldRefs, ...bagRefs], { autoAlpha: 0, scale: 1.08, rotate: 2 });
      gsap.set(goldRefs[0], { autoAlpha: 1, scale: 1, rotate: 0 });
      gsap.set(allChapterRefs, { autoAlpha: 0, y: 38 });
      gsap.set(allChapterRefs[0], { autoAlpha: 1, y: 0 });
      gsap.set(model, { y: 25, scale: 0.92, rotateY: -7, rotateZ: -1.5 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, pin: stage, anticipatePin: 1 },
      });

      timeline.to(model, { y: -15, scale: 1.03, rotateY: 7, rotateZ: 1.5, duration: 1 });
      for (let index = 0; index < 3; index += 1) {
        timeline
          .call(() => setChapter(index + 1), [], ">")
          .to(allChapterRefs[index], { autoAlpha: 0, y: -38, duration: 0.2 })
          .to(allChapterRefs[index + 1], { autoAlpha: 1, y: 0, duration: 0.2 }, "<")
          .to(goldRefs[index], { autoAlpha: 0, scale: 1.08, rotate: -2, duration: 0.2 }, "<")
          .to(goldRefs[index + 1], { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.2 }, "<")
          .to(model, { y: -35 - (index + 1) * 8, rotateY: index % 2 ? -6 : 6, rotateZ: index % 2 ? -1.5 : 1.5, duration: 0.7 });
      }

      gsap.to(progressRef.current, { scaleY: 1, transformOrigin: "top center", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);

  function switchCollection() {
    const outgoing = collection === "gold" ? "gold" : "bags";
    const incoming = collection === "gold" ? "bags" : "gold";
    const outgoingRefs = outgoing === "gold" ? goldImageRefs.current : bagImageRefs.current;
    const incomingRefs = incoming === "gold" ? goldImageRefs.current : bagImageRefs.current;
    const outgoingEl = outgoingRefs[chapter] || outgoingRefs[0];
    const incomingEl = incomingRefs[0];
    if (!outgoingEl || !incomingEl || !modelRef.current) {
      setCollection(incoming);
      setChapter(0);
      return;
    }

    gsap.killTweensOf([outgoingEl, incomingEl, modelRef.current, orbitRef.current]);
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => setCollection(incoming) });
    tl.set(incomingEl, { autoAlpha: 1, xPercent: 115, yPercent: 3, scale: 0.68, rotate: 12 })
      .set(modelRef.current, { transformOrigin: "50% 50%" })
      .to(orbitRef.current, { rotation: "+=180", duration: 1.2, ease: "power2.inOut" }, 0)
      .to(outgoingEl, { xPercent: -118, yPercent: 8, scale: 0.68, rotate: -16, rotateY: -28, duration: 1.2 }, 0)
      .to(incomingEl, { xPercent: 0, yPercent: 0, scale: 1, rotate: 0, rotateY: 0, duration: 1.2 }, 0.03)
      .to(modelRef.current, { scale: 1.02, rotateY: 8, duration: 0.65 }, 0.42)
      .to(modelRef.current, { scale: 1, rotateY: 0, duration: 0.55 }, 0.9)
      .call(() => { setChapter(0); window.scrollTo({ top: rootRef.current?.offsetTop || 0, behavior: "smooth" }); });
  }

  const visibleStory = activeStory[chapter];

  return (
    <section ref={rootRef} className="hero-story">
      <div ref={stageRef} className="hero-stage">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-topline"><span>ESTEEHOUSE / 2026</span></div>
        <div className="hero-progress" aria-hidden="true"><span ref={progressRef} /></div>

        <div className="hero-copy">
          <div className="hero-chapter hero-chapter-live">
            <p className="hero-eyebrow">{visibleStory.eyebrow}</p>
            <h1>{visibleStory.title}</h1>
            <p className="hero-description">{visibleStory.text}</p>
            {chapter === 3 && <Link className="hero-cta" href={collection === "gold" ? "/gold" : "/bags"}>Explore {collection === "gold" ? "EsteeGold" : "EsteeBags"} <ArrowUpRight size={17} strokeWidth={1.7} /></Link>}
          </div>
        </div>

        <div className="hero-model-wrap" aria-hidden="true">
          <div ref={orbitRef} className="hero-switch-orbit"><span /><i /><b /></div>
          <div className="hero-model-ring ring-one" />
          <div className="hero-model-ring ring-two" />
          <div ref={modelRef} className="hero-model">
            <div className="hero-collection-layer hero-collection-gold">
              {goldImages.map((image, index) => <img key={image} ref={(node) => (goldImageRefs.current[index] = node)} src={image} alt="" className="hero-model-image" />)}
            </div>
            <div className="hero-collection-layer hero-collection-bags">
              {bagImages.map((image, index) => <img key={image} ref={(node) => (bagImageRefs.current[index] = node)} src={image} alt="" className="hero-model-image" />)}
            </div>
          </div>
          <div className="hero-model-shadow" />
        </div>

        <div className="hero-collection-switch">
          <button type="button" onClick={switchCollection} aria-label={`Switch to ${collection === "gold" ? "EsteeBags" : "EsteeGold"}`}>
            <span>{collection === "gold" ? "Explore EsteeBags" : "Back to EsteeGold"}</span>
            <MoveRight size={16} />
          </button>
        </div>
        <div className="hero-scroll-hint"><ArrowDown size={15} /><span>Scroll to discover</span></div>
        <div className="hero-index">{collection === "gold" ? "GOLD / 04" : "BAGS / 20"}</div>
      </div>
    </section>
  );
}
