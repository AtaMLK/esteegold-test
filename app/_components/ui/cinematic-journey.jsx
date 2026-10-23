"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "./localized-link";
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useAppearance } from "../../context/appearanceContext";
import { storyFor } from "./product-stories";
import "./cinematic-journey.css";

const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));
const ease = (n) => n * n * (3 - 2 * n);
// Directions change through the story: right/down, right/up, left/down, left/up.
const directions = [[1, .65], [.8, -.65], [-1, .6], [-.7, -.8], [1, .5]];

export default function CinematicJourney({ collection = "house" }) {
  const { locale, theme } = useAppearance();
  const tr = locale === "tr";
  const scenes = useMemo(() => storyFor(collection, locale), [collection, locale]);
  const root = useRef(null);
  const articles = useRef([]);
  const range = useRef(null);
  const lastActive = useRef(0);
  const [active, setActive] = useState(0);
  const [staticView, setStaticView] = useState(false);
  const [ready, setReady] = useState(false);
  const shop = collection === "house" ? "/categories" : `/categories?branch=${collection}`;
  const name = collection === "house" ? "EsteeHouse" : collection === "silver" ? "EsteeGold" : "EsteeBags";
  const cta = tr ? "Koleksiyonu keşfet" : "Explore the collection";

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setStaticView(media.matches);
    change();
    setReady(true);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    if (!ready || staticView) return;
    let frame = 0;
    function paint() {
      frame = 0;
      const rect = root.current.getBoundingClientRect();
      const span = root.current.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / Math.max(1, span));
      const position = progress * (scenes.length - 1);
      const base = Math.floor(position);
      // Keep each composition still for its first 45%, then travel diagonally.
      const mix = ease(clamp((position - base - .45) / .55));
      const nearest = Math.min(scenes.length - 1, base + (mix > .5 ? 1 : 0));
      if (lastActive.current !== nearest) {
        lastActive.current = nearest;
        setActive(nearest);
      }
      if (range.current) {
        range.current.value = String(Math.round(progress * 1000));
        range.current.style.setProperty("--story-progress", `${progress * 100}%`);
        range.current.setAttribute("aria-valuetext", `${nearest + 1} / ${scenes.length}: ${scenes[nearest].label}`);
      }
      articles.current.forEach((article, i) => {
        if (!article) return;
        const isCurrent = i === base;
        const isNext = i === base + 1;
        const visible = isCurrent || isNext;
        const direction = directions[base % directions.length];
        const travel = isCurrent ? -mix : 1 - mix;
        const opacity = isCurrent ? 1 - mix : isNext ? mix : 0;
        article.style.visibility = visible ? "visible" : "hidden";
        article.style.opacity = String(opacity);
        article.style.transform = `translate3d(${travel * direction[0] * 55}vw, ${travel * direction[1] * 42}svh, 0)`;
        article.style.pointerEvents = i === nearest ? "auto" : "none";
        const product = article.querySelector(".cinema-product");
        if (product) {
          const local = clamp(position - i, -.8, 1);
          product.style.setProperty("--object-turn", `${local * (article.dataset.treatment === "fall" ? 65 : 12)}deg`);
          product.style.setProperty("--object-drift", `${local * 30}px`);
        }
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      articles.current.forEach((article) => article?.removeAttribute("style"));
    };
  }, [ready, staticView, scenes]);

  function seek(progress) {
    if (!root.current) return;
    const top = root.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + clamp(progress) * (root.current.offsetHeight - window.innerHeight), behavior: "instant" });
  }

  function switchMode() {
    const top = root.current.getBoundingClientRect().top + window.scrollY;
    setStaticView((value) => !value);
    setActive(0);
    lastActive.current = 0;
    requestAnimationFrame(() => window.scrollTo({ top, behavior: "instant" }));
  }

  const animated = ready && !staticView;
  return (
    <section ref={root} className={`cinema cinema--${collection} ${animated ? "cinema--animated" : "cinema--static"}`} data-theme={theme} style={{ "--scene-count": scenes.length }} aria-label={tr ? `${name} hikâyesi` : `The ${name} story`}>
      <div className="cinema-stage">
        <div className="cinema-top">
          <nav className="cinema-collections" aria-label={tr ? "Koleksiyon seçin" : "Choose a collection"}>
            <Link href="/" aria-current={collection === "house" ? "page" : undefined}>EsteeHouse</Link>
            <Link href="/silver" aria-current={collection === "silver" ? "page" : undefined}>EsteeGold <span>01</span></Link>
            <Link href="/bags" aria-current={collection === "bags" ? "page" : undefined}>EsteeBags <span>02</span></Link>
          </nav>
          <div className="cinema-options"><button onClick={switchMode} type="button" aria-label={tr ? staticView ? "Hareketli hikâye" : "Sakin görünüm" : staticView ? "Play the journey" : "Still edition"} aria-pressed={staticView}>{staticView ? <Play size={12}/> : <Pause size={12}/>}<span>{tr ? staticView ? "Hareketli hikâye" : "Sakin görünüm" : staticView ? "Play the journey" : "Still edition"}</span></button><a href="#collection">{tr ? "Alışverişe geç" : "Skip to shopping"}<ArrowDownRight size={14}/></a></div>
        </div>
        <div className="cinema-scenes">
          {scenes.map((scene, index) => {
            const featuredRing = ["suspended", "fall", "stone", "water", "return"].includes(scene.treatment);
            const visible = !animated || active === index;
            const Heading = index === 0 ? "h1" : "h2";
            const target = collection === "house" ? scene.id === "bags" ? "/bags" : "/silver" : shop;
            return <article key={scene.id} ref={(element) => { articles.current[index] = element; }} className={`cinema-scene cinema-scene--${scene.treatment}`} data-treatment={scene.treatment} aria-hidden={!visible} inert={!visible ? true : undefined}>
              <div className="cinema-scene-ground" aria-hidden="true"/>
              <div className="cinema-copy">
                <p className="cinema-eyebrow"><span className="cinema-dot"/>{scene.label}</p>
                <Heading>{scene.title[0]}<br/><em>{scene.title[1]}</em></Heading>
                <p className="cinema-description">{scene.subtitle}</p>
                <div className="cinema-actions"><Link href={target} className="cinema-cta">{collection === "house" ? scene.id === "bags" ? tr ? "Çanta hikâyesi" : "The bag story" : tr ? "Gümüş hikâyesi" : "The silver story" : cta}<ArrowUpRight size={17}/></Link>{collection === "house" && index === 0 && <Link href="/bags" className="cinema-secondary">EsteeBags <ArrowUpRight size={14}/></Link>}</div>
                {featuredRing && <p className="cinema-material">925 {tr ? "Ayar gümüş" : "Sterling silver"}<span> / </span>{tr ? "Lotus ayrıntısı" : "The lotus detail"}</p>}
              </div>
              <figure className={`cinema-visual ${featuredRing ? "cinema-visual--product" : ""}`}>
                <div className="cinema-orbit" aria-hidden="true"/>
                {scene.treatment === "water" && <div className="cinema-water" aria-hidden="true"><i/><i/><i/></div>}
                <div className="cinema-product"><Image src={scene.image} alt={featuredRing ? tr ? "EsteeGold 925 ayar gümüş lotus yüzük" : "EsteeGold 925 sterling silver lotus ring" : collection === "bags" || scene.id === "bags" ? tr ? "EsteeBags mavi, gri ve turuncu örgü çanta" : "EsteeBags blue paracord bag with grey handle and orange detail" : tr ? "Gerçek hayatta EsteeGold lotus yüzük" : "The actual EsteeGold lotus ring worn on a hand"} fill sizes="(max-width: 700px) 90vw, 58vw" priority={index === 0} className="cinema-photo"/></div>
                <figcaption><span>{featuredRing ? "ESTEEGOLD / 925" : scene.id === "bags" || collection === "bags" ? "ESTEEBAGS / BLUE" : "ESTEEHOUSE / THE LOTUS"}</span><span>{String(index + 1).padStart(2, "0")} — {String(scenes.length).padStart(2, "0")}</span></figcaption>
              </figure>
              <span className="cinema-ghost" aria-hidden="true">{collection === "house" && index === 0 ? "EsteeHouse" : scene.treatment === "water" ? "reflection" : collection === "bags" ? "woven" : "lotus"}</span>
            </article>;
          })}
        </div>
        {animated && <div className="cinema-dock">
          <div className="cinema-dock-meta"><span className="cinema-scroll-hint"><ArrowDown size={13}/>{tr ? "Hikâyeyi takip edin" : "Scroll to follow the story"}</span><p aria-live="polite" aria-atomic="true"><strong>{String(active + 1).padStart(2, "0")}</strong><span> / {String(scenes.length).padStart(2, "0")} — </span>{scenes[active].label}</p><Link href={shop}>{tr ? "Koleksiyon" : "Shop the collection"}<ArrowUpRight size={13}/></Link></div>
          <div className="cinema-scrubber"><button type="button" onClick={() => seek((active - 1) / (scenes.length - 1))} disabled={active === 0} aria-label={tr ? "Önceki sahne" : "Previous scene"}><ArrowLeft size={17}/></button><div className="cinema-range-wrap"><input ref={range} type="range" min="0" max="1000" step="1" defaultValue="0" aria-label={tr ? "Hikâyede ilerleyin" : "Drag to move through the story"} onChange={(event) => seek(Number(event.target.value) / 1000)}/><div className="cinema-ticks" aria-hidden="true">{scenes.map((scene) => <i key={scene.id}/>)}</div></div><button type="button" onClick={() => seek((active + 1) / (scenes.length - 1))} disabled={active === scenes.length - 1} aria-label={tr ? "Sonraki sahne" : "Next scene"}><ArrowRight size={17}/></button></div>
        </div>}
      </div>
    </section>
  );
}
