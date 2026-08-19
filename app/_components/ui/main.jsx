"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
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
          <Link href="/categories">View all pieces <ArrowUpRight size={14} /></Link>
        </div>
        <MiniSlider />
      </section>

      <section className="home-object-story">
        <div className="home-object-image home-object-image-main"><img src="/images/Hero-bg-4.jpg" alt="EsteeHouse object" /></div>
        <div className="home-object-copy">
          <p>02 / THE HOUSE</p><h2>Different forms.<br /><em>One character.</em></h2>
          <p className="home-object-text">EsteeGold brings jewelry and accessories. EsteeBags brings handmade paracord and knitted bags. Different materials, the same attention to character.</p>
          <Link href="/about">Discover the house <ArrowUpRight size={14} /></Link>
        </div>
        <div className="home-object-image home-object-image-small"><img src="/images/Hero-bg-2.jpg" alt="EsteeHouse detail" /></div>
      </section>

      <section className="home-category-callout">
        <div><p>03 / FIND YOUR FORM</p><h2>Two directions.<br /><em>One house.</em></h2></div>
        <Link href="/categories" className="home-round-link"><span>Explore<br />collection</span><ArrowDownRight size={18} /></Link>
      </section>

      <section className="home-manifesto">
        <div className="home-manifesto-orbit orbit-a" /><div className="home-manifesto-orbit orbit-b" />
        <p>04 / ESTEEHOUSE</p>
        <h2>Keep the things<br /><em>worth keeping.</em></h2>
        <div className="home-manifesto-bottom"><span>EsteeGold / EsteeBags. Made with character.</span><Link href="/categories">Enter the collection <ArrowUpRight size={15} /></Link></div>
      </section>
    </main>
  );
}
