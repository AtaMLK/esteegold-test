"use client";

import Link from "next/link";
import About from "./about";
import CardMainLeft from "./card-image-left";
import CardMainRight from "./card-image-right";
import Hero from "./hero";
import MiniSlider from "./MiniSlider";

function Main() {
  return (
    <div className="mainpage-container">
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-black/45">
              The collection
            </p>
            <h2 className="max-w-3xl font-serif text-5xl font-normal leading-[.92] tracking-[-.045em] md:text-7xl">
              Objects made for a closer look.
            </h2>
          </div>
          <Link
            href="/product"
            className="w-fit border-b border-black/35 pb-2 text-[10px] uppercase tracking-[.18em]"
          >
            View all pieces
          </Link>
        </div>
        <MiniSlider />
      </section>

      <section className="card-section my-20 grid gap-8 px-6 md:px-10 lg:grid-cols-2">
        <Link href="/product" className="block">
          <CardMainLeft file="Product" />
        </Link>
        <Link href="/gallery" className="block">
          <CardMainRight file="Gallery" />
        </Link>
      </section>

      <About />
    </div>
  );
}

export default Main;
