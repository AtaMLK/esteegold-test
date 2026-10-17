"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

const pieces = [
  { name: "A study in shape", category: "EsteeGold / Jewelry", image: "/images/Products-page/Ring.jpg", href: "/categories?branch=gold" },
  { name: "The everyday weave", category: "EsteeBags / Handmade", image: "/images/bags/bag1.jpg", href: "/categories?branch=bags" },
  { name: "A little expression", category: "EsteeGold / Earrings", image: "/images/Products-page/Earrings.jpg", href: "/categories?branch=gold" },
  { name: "Texture, carried", category: "EsteeBags / Handmade", image: "/images/bags/bag3.jpg", href: "/categories?branch=bags" },
  { name: "Color has a place", category: "EsteeGold / Details", image: "/images/Hero-bg-1.jpg", href: "/categories?branch=gold" },
  { name: "Knotted by hand", category: "EsteeBags / Texture", image: "/images/bags/bag18.jpg", href: "/categories?branch=bags" },
  { name: "Better together", category: "EsteeGold / Combinations", image: "/images/Products-page/Combinations.jpg", href: "/categories?branch=gold" },
  { name: "The softer side", category: "EsteeBags / Handmade", image: "/images/bags/bag8.jpg", href: "/categories?branch=bags" },
];

const wrap = (value) => ((value % pieces.length) + pieces.length) % pieces.length;

export default function RadialGallery() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const controlsRef = useRef(null);
  const dragRef = useRef(false);
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(Draggable);
    const stage = stageRef.current;
    const cards = Array.from(stage.querySelectorAll(".arc-card"));
    const proxy = document.createElement("div");
    const position = { value: 0 };
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let metrics;
    let selectedIndex = 0;
    let origin = 0;
    let samples = [];
    let animation;
    let dragReset;
    let reduced = motionPreference.matches;
    const setters = cards.map((card) => ({ transform: gsap.quickSetter(card, "css"), image: card.querySelector(".arc-card-image") }));

    function render() {
      if (!metrics) return;
      cards.forEach((card, index) => {
        const difference = wrap(index - position.value + pieces.length / 2) - pieces.length / 2;
        const distance = Math.abs(difference);
        const angle = difference * metrics.step;
        const radians = angle * Math.PI / 180;
        const prominence = Math.max(0, 1 - distance);
        setters[index].transform({
          x: Math.sin(radians) * metrics.radius,
          y: (1 - Math.cos(radians)) * metrics.radius,
          rotation: angle,
          scale: 0.84 + prominence * 0.16,
          opacity: Math.max(0, Math.min(1, 3 - distance)) * (0.6 + prominence * 0.4),
          zIndex: Math.round(100 - distance * 10),
          visibility: distance < 3 ? "visible" : "hidden",
        });
        setters[index].image.style.filter = "grayscale(" + Math.min(1, distance) * 0.9 + ")";
        card.tabIndex = distance < 0.5 ? 0 : -1;
        card.setAttribute("aria-hidden", distance >= 3 ? "true" : "false");
        card.setAttribute("aria-pressed", distance < 0.5 ? "true" : "false");
      });
      const nearest = wrap(Math.round(position.value));
      if (nearest !== selectedIndex) { selectedIndex = nearest; setSelected(nearest); }
    }

    function measure() {
      const width = stage.clientWidth;
      metrics = { radius: width < 700 ? width * 1.13 : Math.max(760, width * 0.81), step: width < 700 ? 36 : 22, pixels: width < 700 ? 190 : 290 };
      render();
    }

    function settle(target, momentum = false) {
      animation?.kill();
      animation = gsap.to(position, { value: target, duration: reduced ? 0 : momentum ? 1.05 : 0.7, ease: "power3.out", onUpdate: render, onComplete: render });
    }

    function select(index) {
      const difference = wrap(index - wrap(position.value) + pieces.length / 2) - pieces.length / 2;
      settle(Math.round(position.value + difference));
    }

    measure();
    const context = gsap.context(() => {
      const [draggable] = Draggable.create(proxy, {
        type: "x",
        trigger: stage,
        dragClickables: true,
        allowNativeTouchScrolling: true,
        minimumMovement: 5,
        onPress() {
          animation?.kill();
          clearTimeout(dragReset);
          dragRef.current = false;
          origin = position.value;
          gsap.set(proxy, { x: 0 });
          this.update();
          samples = [{ x: 0, time: performance.now() }];
        },
        onDrag() {
          dragRef.current = true;
          position.value = origin - this.x / metrics.pixels;
          const now = performance.now();
          samples.push({ x: this.x, time: now });
          samples = samples.filter((sample) => now - sample.time < 110);
          render();
        },
        onRelease() {
          const first = samples[0];
          const last = samples[samples.length - 1];
          const elapsed = first && last ? Math.max(16, performance.now() - first.time) : 16;
          const velocity = first && last ? (last.x - first.x) / elapsed : 0;
          const drift = reduced ? 0 : Math.max(-2.2, Math.min(2.2, -velocity * 260 / metrics.pixels));
          settle(Math.round(position.value + drift), true);
          dragReset = setTimeout(() => { dragRef.current = false; }, 150);
        },
      });
      controlsRef.current = { previous: () => settle(Math.round(position.value) - 1), next: () => settle(Math.round(position.value) + 1), select };
      return () => draggable.kill();
    }, rootRef);

    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    const onMotionChange = (event) => { reduced = event.matches; settle(Math.round(position.value)); };
    motionPreference.addEventListener("change", onMotionChange);
    setReady(true);

    return () => {
      observer.disconnect();
      motionPreference.removeEventListener("change", onMotionChange);
      clearTimeout(dragReset);
      animation?.kill();
      controlsRef.current = null;
      context.revert();
    };
  }, []);

  function onKeyDown(event) {
    if (event.key === "ArrowRight") { event.preventDefault(); controlsRef.current?.next(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); controlsRef.current?.previous(); }
    if (event.key === "Home") { event.preventDefault(); controlsRef.current?.select(0); }
    if (event.key === "End") { event.preventDefault(); controlsRef.current?.select(pieces.length - 1); }
  }

  return (
    <section id="collection" ref={rootRef} className={"radial-gallery " + (ready ? "is-ready" : "")} aria-labelledby="gallery-title" aria-roledescription="carousel" onKeyDown={onKeyDown}>
      <div className="gallery-heading"><p className="house-eyebrow">A few things worth keeping</p><h2 id="gallery-title">The house <em>edit.</em></h2><p>Follow what catches your eye.</p></div>
      <span className="gallery-watermark" aria-hidden="true">COLLECTION</span>
      <div className="arc-stage" ref={stageRef} tabIndex={0} aria-label="Collection gallery. Drag horizontally or use the left and right arrow keys." aria-describedby="gallery-instructions">
        <div className="arc-guide" aria-hidden="true" />
        {pieces.map((piece, index) => (
          <button key={piece.name} type="button" className="arc-card" aria-label={"Center " + piece.name + ", " + (index + 1) + " of " + pieces.length} onClick={() => { if (!dragRef.current) controlsRef.current?.select(index); }}>
            <span className="arc-card-image"><Image src={piece.image} alt={piece.name} fill sizes="(max-width: 700px) 58vw, 25vw" draggable={false} className="arc-photo" /></span>
            <span className="arc-card-number">{String(index + 1).padStart(2, "0")} / EH</span>
          </button>
        ))}
      </div>
      <div className="gallery-controls">
        <button type="button" className="gallery-arrow" onClick={() => controlsRef.current?.previous()} aria-label="Previous piece"><ArrowLeft size={21} /></button>
        <div className="gallery-caption" aria-live="polite" aria-atomic="true"><p className="house-eyebrow">{pieces[selected].category}</p><h3>{pieces[selected].name}</h3><Link href={pieces[selected].href} className="house-text-link">Explore collection <ArrowUpRight size={15} /></Link></div>
        <button type="button" className="gallery-arrow" onClick={() => controlsRef.current?.next()} aria-label="Next piece"><ArrowRight size={21} /></button>
      </div>
      <div className="gallery-bottom"><p id="gallery-instructions"><MoveHorizontal size={15} /> Drag to explore <span>or use the arrow keys</span></p><span>{String(selected + 1).padStart(2, "0")} — {String(pieces.length).padStart(2, "0")}</span></div>
    </section>
  );
}
