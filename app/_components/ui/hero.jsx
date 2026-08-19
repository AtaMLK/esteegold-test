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
  const switchTimelineRef = useRef(null);
  const [collection, setCollection] = useState("gold");
  const [chapter, setChapter] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const model = modelRef.current;
    if (!root || !stage || !model) return;

    const ctx = gsap.context(() => {
      const activeImages = (collection === "gold" ? goldImageRefs.current : bagImageRefs.current).filter(Boolean);
      const inactiveImages = (collection === "gold" ? bagImageRefs.current : goldImageRefs.current).filter(Boolean);
      const allImages = [...activeImages, ...inactiveImages];
      const chapters = chapterRefs.current.filter(Boolean);

      gsap.set(chapters, { autoAlpha: 0, y: 38 });
      gsap.set(chapters[0], { autoAlpha: 1, y: 0 });
      gsap.set(allImages, { autoAlpha: 0, scale: 1.08, rotate: 2, xPercent: 0, yPercent: 0, zIndex: 1 });
      gsap.set(activeImages, { autoAlpha: 0 });
      gsap.set(activeImages[0], { autoAlpha: 1, scale: 1, rotate: 0, zIndex: 3 });
      gsap.set(inactiveImages[0], { autoAlpha: 1, scale: 0.9, rotate: 0, zIndex: 1 });
      gsap.set(model, { y: 25, scale: 0.92, rotateY: -7, rotateZ: -1.5 });
      gsap.set(progressRef.current, { scaleY: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1, pin: stage, anticipatePin: 1 },
      });
      timeline.to(model, { y: -15, scale: 1.03, rotateY: 7, rotateZ: 1.5, duration: 1 });

      for (let index = 0; index < 3; index += 1) {
        timeline
          .call(() => setChapter(index + 1))
          .to(chapters[index], { autoAlpha: 0, y: -38, duration: 0.2 })
          .to(chapters[index + 1], { autoAlpha: 1, y: 0, duration: 0.2 }, "<")
          .to(activeImages[index], { autoAlpha: 0, scale: 1.08, rotate: -2, duration: 0.2 }, "<")
          .to(activeImages[index + 1], { autoAlpha: 1, scale: 1, rotate: 0, zIndex: 3, duration: 0.2 }, "<")
          .to(model, { y: -35 - (index + 1) * 8, rotateY: index % 2 ? -6 : 6, rotateZ: index % 2 ? -1.5 : 1.5, duration: 0.7 });
      }

      gsap.to(progressRef.current, {
        scaleY: 1,
        transformOrigin: "top center",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true },
      });
    }, root);

    return () => ctx.revert();
  }, [collection]);

  function switchCollection() {
    if (switchTimelineRef.current?.isActive()) return;

    const fromGold = collection === "gold";
    const outgoingRefs = fromGold ? goldImageRefs.current : bagImageRefs.current;
    const incomingRefs = fromGold ? bagImageRefs.current : goldImageRefs.current;
    const outgoing = outgoingRefs[chapter] || outgoingRefs[0];
    const incoming = incomingRefs[0];
    if (!outgoing || !incoming || !modelRef.current) return;

    const nextCollection = fromGold ? "bags" : "gold";
    const timeline = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        setCollection(nextCollection);
        setChapter(0);
        switchTimelineRef.current = null;
      },
    });
    switchTimelineRef.current = timeline;

    gsap.killTweensOf([outgoing, incoming, modelRef.current, orbitRef.current]);
    gsap.set(outgoing, { autoAlpha: 1, xPercent: 0, yPercent: 0, scale: 1, rotate: 0, rotateY: 0, zIndex: 5 });
    gsap.set(incoming, { autoAlpha: 1, xPercent: 122, yPercent: -4, scale: 0.72, rotate: 14, rotateY: -18, zIndex: 7 });

    timeline
      .to(orbitRef.current, { rotation: "+=180", duration: 1.35, ease: "power2.inOut" }, 0)
      .to(outgoing, { xPercent: 118, yPercent: 10, scale: 0.66, rotate: 18, rotateY: 28, zIndex: 4, duration: 1.2, ease: "power2.inOut" }, 0)
      .to(incoming, { xPercent: 0, yPercent: 0, scale: 1, rotate: 0, rotateY: 0, zIndex: 7, duration: 1.3, ease: "power3.inOut" }, 0.08)
      .to(modelRef.current, { scale: 1.045, rotateY: 8, duration: 0.6 }, 0.38)
      .to(modelRef.current, { scale: 1, rotateY: 0, duration: 0.55 }, 0.92)
      .set(outgoing, { xPercent: 0, yPercent: 0, scale: 0.92, rotate: 0, rotateY: 0, zIndex: 2, autoAlpha: 1 }, 1.25);
  }

  const activeStory = stories[collection];
  return (
    <section ref={rootRef} className="hero-story">
      <div ref={stageRef} className="hero-stage">
        <div className="hero-noise" aria-hidden="true" /><div className="hero-glow hero-glow-one" aria-hidden="true" /><div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="hero-topline"><span>ESTEEHOUSE / 2026</span></div><div className="hero-progress" aria-hidden="true"><span ref={progressRef} /></div>
        <div className="hero-copy">{activeStory.map((story, index) => <div key={story.eyebrow} ref={(node) => (chapterRefs.current[index] = node)} className="hero-chapter"><p className="hero-eyebrow">{story.eyebrow}</p><h1>{story.title}</h1><p className="hero-description">{story.text}</p>{index === 3 && <Link className="hero-cta" href={collection === "gold" ? "/gold" : "/bags"}>Explore {collection === "gold" ? "EsteeGold" : "EsteeBags"} <ArrowUpRight size={17} strokeWidth={1.7} /></Link>}</div>)}</div>
        <div className="hero-model-wrap" aria-hidden="true">
          <div ref={orbitRef} className="hero-switch-orbit"><span /><i /><b /></div><div className="hero-model-ring ring-one" /><div className="hero-model-ring ring-two" />
          <div ref={modelRef} className="hero-model">
            <div className="hero-collection-layer hero-collection-gold">{goldImages.map((image, index) => <img key={image} ref={(node) => (goldImageRefs.current[index] = node)} src={image} alt="" className="hero-model-image" />)}</div>
            <div className="hero-collection-layer hero-collection-bags">{bagImages.map((image, index) => <img key={image} ref={(node) => (bagImageRefs.current[index] = node)} src={image} alt="" className="hero-model-image" onError={(event) => { event.currentTarget.src = "/images/Hero-bg-3.jpg"; }} />)}</div>
          </div><div className="hero-model-shadow" />
        </div>
        <div className="hero-collection-switch"><button type="button" onClick={switchCollection} aria-label={`Switch to ${collection === "gold" ? "EsteeBags" : "EsteeGold"}`}><span>{collection === "gold" ? "Explore EsteeBags" : "Back to EsteeGold"}</span><MoveRight size={16} /></button></div>
        <div className="hero-scroll-hint"><ArrowDown size={15} /><span>Scroll to discover</span></div><div className="hero-index">{collection === "gold" ? "GOLD / 04" : "BAGS / 20"}</div>
      </div>
    </section>
  );
}
