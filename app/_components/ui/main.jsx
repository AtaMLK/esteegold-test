"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import About from "./about";
import Hero from "./hero";
import MiniSlider from "./MiniSlider";
import "./home-sections.css";

export default function Main() {
  return (
    <main className="mainpage-container">
      <Hero />

      <section className="home-collection">
        <div className="home-section-heading">
          <div><p>01 / THE COLLECTION</p><h2>Objects made for<br /><em>a closer look.</em></h2></div>
          <Link href="/product">View all pieces <ArrowUpRight size={14} /></Link>
        </div>
        <MiniSlider />
      </section>

      <section className="home-object-story">
        <div className="home-object-image home-object-image-main"><img src="/images/Hero-bg-4.jpg" alt="Estee Gold Studio object" /></div>
        <div className="home-object-copy">
          <p>02 / THE STUDIO</p><h2>A different kind<br /><em>of object.</em></h2>
          <p className="home-object-text">Designed between restraint and curiosity. We make pieces that don't ask for attention — they keep it.</p>
          <Link href="/about">Discover the studio <ArrowUpRight size={14} /></Link>
        </div>
        <div className="home-object-image home-object-image-small"><img src="/images/Hero-bg-2.jpg" alt="Studio detail" /></div>
      </section>

      <section className="home-category-callout">
        <div><p>03 / FIND YOUR FORM</p><h2>Four directions.<br /><em>One signature.</em></h2></div>
        <Link href="/categories" className="home-round-link"><span>Explore<br />categories</span><ArrowDownRight size={18} /></Link>
      </section>

      <About />

      <section className="home-manifesto">
        <div className="home-manifesto-orbit orbit-a" /><div className="home-manifesto-orbit orbit-b" />
        <p>04 / ESTEE GOLD STUDIO</p>
        <h2>Keep the things<br /><em>worth keeping.</em></h2>
        <div className="home-manifesto-bottom"><span>Objects with character. Details with a reason.</span><Link href="/product">Enter the collection <ArrowUpRight size={15} /></Link></div>
      </section>
    </main>
  );
}
