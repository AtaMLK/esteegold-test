"use client";

import { useAppearance } from "../../context/appearanceContext";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "./localized-link";
import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { collectionLinks } from "./house-content";
import { getCollection, localizedChapters } from "./house-content-tr";

function cameraPath(width, height) {
  const point = (horizontal, vertical) => `${-horizontal * width},${-vertical * height}`;
  return `M 0,0 C ${point(0, 0.4)} ${point(0, 0.8)} ${point(0, 1.2)} C ${point(0, 1.7)} ${point(0.65, 2)} ${point(1.2, 2)} C ${point(1.68, 2)} ${point(2.16, 2)} ${point(2.65, 2)} C ${point(3.2, 2)} ${point(3.3, 1)} ${point(3.85, 1)} C ${point(4.4, 1)} ${point(4.4, 1.7)} ${point(4.95, 1.7)} C ${point(5.5, 1.7)} ${point(6.05, 0.5)} ${point(6.05, 1.05)} C ${point(6.05, 1.45)} ${point(6.05, 1.9)} ${point(6.05, 2.3)}`;
}

export default function ScrollJourney({ collection = "house" }) {
  const { translateText, locale } = useAppearance();
  const chapters = useMemo(() => localizedChapters(collection, locale), [collection, locale]);
  const config = getCollection(collection, locale);
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const progressRef = useRef(null);
  const scrollControlRef = useRef(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [motionPreference, setMotionPreference] = useState("auto");
  const [motionAvailable, setMotionAvailable] = useState(true);

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

    const roomQuery = "(min-width: 701px) and (min-height: 420px), (max-width: 700px) and (min-height: 560px)";
    const room = window.matchMedia(roomQuery);
    function updateAvailability() { setMotionAvailable(room.matches); }
    updateAvailability();
    room.addEventListener("change", updateAvailability);
    const motionQuery = motionPreference === "journey" ? roomQuery : "(prefers-reduced-motion: no-preference) and (min-width: 701px) and (min-height: 420px), (prefers-reduced-motion: no-preference) and (max-width: 700px) and (min-height: 560px)";
    if (motionPreference !== "text") matchMedia.add(motionQuery, () => {
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

    return () => { disposed = true; matchMedia.revert(); room.removeEventListener("change", updateAvailability); };
  }, [chapters, motionPreference]);

  function toggleMotion() {
    const top = rootRef.current.getBoundingClientRect().top + window.scrollY;
    setEnhanced(false);
    setActive(0);
    activeRef.current = 0;
    setMotionPreference(enhanced ? "text" : "journey");
    requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
  }

  function nextChapter() {
    const control = scrollControlRef.current;
    if (!control) return;
    window.scrollTo({ top: control.start + (control.end - control.start) * Math.min(1, control.progress + 0.13), behavior: "smooth" });
  }

  return (
    <section ref={rootRef} className="scroll-journey" aria-label={locale === "tr" ? `${config.name} dünyasında bir yolculuk` : `A journey through ${config.name}`}>
      <div ref={stageRef} className="journey-stage">
        <div className="journey-topline" aria-hidden="true"><span>{translateText("Independent objects / Istanbul")}</span><span>{config.eyebrow}</span></div>
        <nav className="collection-switcher" aria-label={translateText("Choose your collection")}>{collectionLinks.map((item) => <Link key={item.key} href={item.href} aria-current={collection === item.key ? "page" : undefined}>{translateText(item.label)}<span aria-hidden="true">↗</span></Link>)}</nav>
        <div className="journey-mode"><button type="button" onClick={toggleMotion} disabled={!motionAvailable} aria-pressed={enhanced}>{enhanced ? translateText("Switch to text edition") : translateText("Play scroll journey")}</button>{!enhanced && <span>{motionAvailable ? translateText("Text edition · motion is optional") : translateText("Text edition · more screen height enables the journey")}</span>}</div>
        <a href="#collection" className="journey-skip">{translateText("Skip to the collection")}<ArrowDownRight size={14} /></a>
        <div className="journey-world" ref={cameraRef}>
          {chapters.map((chapter, index) => (
            <article key={chapter.label} className={`journey-chapter journey-chapter--${chapter.layout}`} aria-hidden={enhanced && active !== index ? true : undefined} inert={enhanced && active !== index ? true : undefined}>
              <div className="journey-watermark" aria-hidden="true">{index === 0 ? config.watermark : String(index + 1).padStart(2, "0")}</div>
              <div className="journey-copy">
                <p className="house-eyebrow"><span>{String(index + 1).padStart(2, "0")} /</span> {chapter.label}</p>
                {index === 0 ? <h1>{chapter.title}<br /><em>{chapter.emphasis}</em></h1> : <h2>{chapter.title}<br /><em>{chapter.emphasis}</em></h2>}
                <p className="journey-description">{chapter.description}</p>
                <Link href={chapter.href} className="house-text-link">{chapter.link}<ArrowUpRight size={16} /></Link>
              </div>
              <figure className="journey-figure">
                <div className="journey-image"><Image src={chapter.image} alt={chapter.alt} fill priority={index === 0} sizes="(max-width: 700px) 80vw, 43vw" className="journey-photo" /></div>
                <figcaption><span>EsteeHouse / {chapter.label}</span><span>{translateText("Made with character ↗")}</span></figcaption>
              </figure>
              {index === 0 && <span className="journey-edition">{translateText("The house edit")}<br />{translateText("Volume 01 — 2026")}</span>}
            </article>
          ))}
        </div>
        <div className="journey-bottomline">
          <button type="button" onClick={nextChapter} className="journey-scroll" aria-label={translateText("Continue through the journey")}><ArrowDown size={16} /><span>{translateText("Scroll to wander")}</span></button>
          <p className="journey-current" aria-live="off">{String(active + 1).padStart(2, "0")} <span>/ 08</span> <span>{chapters[active].label}</span></p>
          <Link href={config.shop} className="journey-shop">{config.shopLabel} <ArrowUpRight size={14} /></Link>
        </div>
        <div className="journey-progress" aria-hidden="true"><span ref={progressRef} /></div>
      </div>
    </section>
  );
}
