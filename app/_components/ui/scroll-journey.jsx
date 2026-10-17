"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

const chapters = [
  { label: "The house", title: "Objects with", emphasis: "character.", description: "Jewelry, accessories and handmade bags. Different materials. The same instinct to make something personal.", image: "/images/Products-page/Ring.jpg", alt: "Sculptural jewelry from the EsteeGold collection", href: "/categories", link: "Discover the collection", x: 0, y: 0, layout: "opening" },
  { label: "A closer look", title: "The detail is", emphasis: "the difference.", description: "A curve. A knot. The way the light settles on a surface. Small decisions that make a piece feel like yours.", image: "/images/Hero-bg-2.jpg", alt: "Color and metal details in a handmade necklace", href: "/gold", link: "Meet EsteeGold", x: 0, y: 1.2, layout: "detail" },
  { label: "EsteeGold", title: "A quiet kind", emphasis: "of presence.", description: "Expressive shapes and considered details. Pieces that become part of the way you move through the world.", image: "/images/Products-page/Earrings.jpg", alt: "Earrings from the EsteeGold jewelry collection", href: "/categories?branch=gold", link: "Explore jewelry", x: 1.2, y: 2, layout: "gold" },
  { label: "EsteeBags", title: "Made by hand.", emphasis: "Carried your way.", description: "Tactile, a little unexpected, and unmistakably handmade. There is a story in every knot.", image: "/images/bags/bag1.jpg", alt: "Hand-knotted shoulder bag with a textured braided strap", href: "/categories?branch=bags", link: "Explore bags", x: 2.65, y: 2, layout: "bags" },
  { label: "The process", title: "Leave room", emphasis: "for the hand.", description: "Texture you can see. Detail you can feel. The small irregularities are part of the character.", image: "/images/bags/bag3.jpg", alt: "Handmade bag construction and woven texture", href: "/about", link: "Inside the house", x: 3.85, y: 1, layout: "process" },
  { label: "The unexpected", title: "Follow your", emphasis: "own thread.", description: "A little color. A different proportion. A familiar object, seen another way.", image: "/images/Hero-bg-1.jpg", alt: "Colorful feather earrings with gold-toned discs", href: "/gold", link: "Explore EsteeGold", x: 4.95, y: 1.7, layout: "color" },
  { label: "Keep the character", title: "Wear it often.", emphasis: "Make it yours.", description: "The best pieces do not wait for an occasion. They become part of your everyday.", image: "/images/bags/bag18.jpg", alt: "A piece from the handmade EsteeBags collection", href: "/bags", link: "Meet EsteeBags", x: 6.05, y: 1.05, layout: "everyday" },
  { label: "The collection", title: "Some things", emphasis: "stay with you.", description: "Take a closer look at the pieces, textures and details that make up our house.", image: "/images/Products-page/Combinations.jpg", alt: "Jewelry combinations from the EsteeHouse collection", href: "#collection", link: "Explore the edit", x: 6.05, y: 2.3, layout: "finale" },
];

function cameraPath(width, height) {
  const point = (horizontal, vertical) => `${-horizontal * width},${-vertical * height}`;
  return `M 0,0 C ${point(0, 0.4)} ${point(0, 0.8)} ${point(0, 1.2)} C ${point(0, 1.7)} ${point(0.65, 2)} ${point(1.2, 2)} C ${point(1.68, 2)} ${point(2.16, 2)} ${point(2.65, 2)} C ${point(3.2, 2)} ${point(3.3, 1)} ${point(3.85, 1)} C ${point(4.4, 1)} ${point(4.4, 1.7)} ${point(4.95, 1.7)} C ${point(5.5, 1.7)} ${point(6.05, 0.5)} ${point(6.05, 1.05)} C ${point(6.05, 1.45)} ${point(6.05, 1.9)} ${point(6.05, 2.3)}`;
}

export default function ScrollJourney() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const progressRef = useRef(null);
  const scrollControlRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
    const root = rootRef.current;
    const stage = stageRef.current;
    const camera = cameraRef.current;
    const panels = Array.from(camera.querySelectorAll(".journey-chapter"));
    const media = panels.map((panel) => panel.querySelector(".journey-image"));
    const captions = panels.map((panel) => panel.querySelector(".journey-copy"));
    const matchMedia = gsap.matchMedia();
    let disposed = false;

    matchMedia.add("(prefers-reduced-motion: no-preference) and (min-height: 620px)", () => {
      setEnhanced(true);
      root.dataset.motion = "full";
      let viewportWidth = stage.clientWidth;
      let viewportHeight = stage.clientHeight;
      const setters = media.map((element) => ({ scale: gsap.quickSetter(element, "scale"), y: gsap.quickSetter(element, "y", "px") }));
      const copySetters = captions.map((element) => gsap.quickSetter(element, "y", "px"));

      function placePanels() {
        viewportWidth = stage.clientWidth;
        viewportHeight = stage.clientHeight;
        panels.forEach((panel, index) => {
          gsap.set(panel, { left: chapters[index].x * viewportWidth, top: chapters[index].y * viewportHeight });
        });
      }

      function render(tween) {
        const cameraX = Number(gsap.getProperty(camera, "x"));
        const cameraY = Number(gsap.getProperty(camera, "y"));
        let nearest = 0;
        let nearestDistance = Infinity;
        panels.forEach((panel, index) => {
          const offsetX = (chapters[index].x * viewportWidth + cameraX) / viewportWidth;
          const offsetY = (chapters[index].y * viewportHeight + cameraY) / viewportHeight;
          const distance = Math.hypot(offsetX, offsetY);
          if (distance < nearestDistance) { nearestDistance = distance; nearest = index; }
          const proximity = Math.max(0, 1 - distance);
          setters[index].scale(1.025 + (1 - proximity) * 0.085);
          setters[index].y(-offsetY * Math.min(viewportHeight * 0.055, 40));
          copySetters[index](offsetY * Math.min(viewportHeight * 0.035, 26));
          panel.style.visibility = distance < 1.8 ? "visible" : "hidden";
        });
        gsap.set(progressRef.current, { scaleX: tween.progress() });
        if (activeRef.current !== nearest) { activeRef.current = nearest; setActive(nearest); }
      }

      placePanels();
      const tween = gsap.to(camera, {
        duration: 1,
        ease: "none",
        motionPath: () => ({ path: cameraPath(viewportWidth, viewportHeight), autoRotate: false }),
        onUpdate() { render(this); },
        scrollTrigger: {
          trigger: root,
          pin: stage,
          start: "top top",
          end: () => `+=${viewportHeight * (viewportWidth < 700 ? 8 : 9.5)}`,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: placePanels,
          onRefresh(self) { scrollControlRef.current = self; },
        },
      });
      scrollControlRef.current = tween.scrollTrigger;
      render(tween);
      document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });

      return () => {
        scrollControlRef.current = null;
        root.removeAttribute("data-motion");
        panels.forEach((panel) => { panel.style.visibility = ""; });
        [...media, ...captions].forEach((element) => { element.style.removeProperty("transform"); });
        if (!disposed) { setEnhanced(false); setActive(0); }
        activeRef.current = 0;
      };
    }, root);

    return () => { disposed = true; matchMedia.revert(); };
  }, []);

  function nextChapter() {
    const control = scrollControlRef.current;
    if (!control) return;
    window.scrollTo({ top: control.start + (control.end - control.start) * Math.min(1, control.progress + 0.13), behavior: "smooth" });
  }

  return (
    <section ref={rootRef} className="scroll-journey" aria-label="A journey through EsteeHouse">
      <div ref={stageRef} className="journey-stage">
        <div className="journey-topline" aria-hidden="true"><span>Independent objects / Istanbul</span><span>Jewelry & handmade bags</span></div>
        <a href="#collection" className="journey-skip">Skip to the collection <ArrowDownRight size={14} /></a>
        <div className="journey-world" ref={cameraRef}>
          {chapters.map((chapter, index) => (
            <article key={chapter.label} className={`journey-chapter journey-chapter--${chapter.layout}`} aria-hidden={enhanced && active !== index ? true : undefined} inert={enhanced && active !== index ? true : undefined}>
              <div className="journey-watermark" aria-hidden="true">{index === 0 ? "ESTEEHOUSE" : index === 3 ? "ESTEEBAGS" : index === 2 ? "ESTEEGOLD" : String(index + 1).padStart(2, "0")}</div>
              <div className="journey-copy">
                <p className="house-eyebrow"><span>{String(index + 1).padStart(2, "0")} /</span> {chapter.label}</p>
                {index === 0 ? <h1>{chapter.title}<br /><em>{chapter.emphasis}</em></h1> : <h2>{chapter.title}<br /><em>{chapter.emphasis}</em></h2>}
                <p className="journey-description">{chapter.description}</p>
                <Link href={chapter.href} className="house-text-link">{chapter.link}<ArrowUpRight size={16} /></Link>
              </div>
              <figure className="journey-figure">
                <div className="journey-image"><Image src={chapter.image} alt={chapter.alt} fill priority={index === 0} sizes="(max-width: 700px) 80vw, 43vw" className="journey-photo" /></div>
                <figcaption><span>EsteeHouse / {chapter.label}</span><span>Made with character ↗</span></figcaption>
              </figure>
              {index === 0 && <span className="journey-edition">The house edit<br />Volume 01 — 2026</span>}
            </article>
          ))}
        </div>
        <div className="journey-bottomline">
          <button type="button" onClick={nextChapter} className="journey-scroll" aria-label="Continue through the journey"><ArrowDown size={16} /><span>Scroll to wander</span></button>
          <p className="journey-current" aria-live="off">{String(active + 1).padStart(2, "0")} <span>/ 08</span> <span>{chapters[active].label}</span></p>
          <Link href="/categories" className="journey-shop">Shop the house <ArrowUpRight size={14} /></Link>
        </div>
        <div className="journey-progress" aria-hidden="true"><span ref={progressRef} /></div>
      </div>
    </section>
  );
}
