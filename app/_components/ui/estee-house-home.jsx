"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

function CollectionPanel({ number, name, subtitle, href, image, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.96]);

  return (
    <section ref={ref} className="relative min-h-[92vh] overflow-hidden bg-black">
      <motion.div style={{ y, scale }} className="absolute inset-[-5%]">
        <Image src={image} alt="" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/25" />
      </motion.div>
      <div className="relative flex min-h-[92vh] flex-col justify-between p-5 text-white md:p-10">
        <div className="flex justify-between text-[9px] uppercase tracking-[0.25em]">
          <span>0{number}</span><span>{subtitle}</span>
        </div>
        <div className="max-w-5xl">
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-white/65">EsteeHouse collection</p>
          <h2 className="font-serif text-[clamp(4.5rem,13vw,13rem)] leading-[0.72] tracking-[-0.075em]">{name}</h2>
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-md text-sm leading-6 text-white/75">{children}</p>
            <Link href={href} className="group flex w-fit items-center gap-3 border-b border-white/40 pb-2 text-[9px] uppercase tracking-[0.24em]">
              Enter collection <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function EsteeHouseHome() {
  return (
    <div className="overflow-hidden bg-[var(--paper)] text-[var(--ink)]">
      <section className="relative min-h-[100svh] bg-[#d8d0c1]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div initial={{ scale: 1.12, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0">
            <Image src="/images/Hero-bg-1.jpg" alt="EsteeHouse" fill priority className="object-cover" sizes="100vw" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
        </div>
        <div className="relative flex min-h-[100svh] flex-col justify-between p-5 text-white md:p-8">
          <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-white/55">A creative house</p>
              <p className="mt-2 max-w-[170px] text-xs leading-5 text-white/75">Jewelry, accessories and handmade bags with their own character.</p>
            </div>
            <div className="hidden md:block" /><div className="hidden md:block" />
            <div className="text-right"><p className="text-[8px] uppercase tracking-[0.3em] text-white/55">01 / 02</p><p className="mt-2 text-xs text-white/75">EsteeGold · EsteeBags</p></div>
          </div>
          <div className="pb-8 md:pb-12">
            <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65, duration: 0.9 }} className="mb-5 text-[9px] uppercase tracking-[0.32em] text-white/65">Welcome to</motion.p>
            <motion.h1 initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45, duration: 1.1, ease: [0.76, 0, 0.24, 1] }} className="max-w-6xl font-serif text-[clamp(5.5rem,15vw,15rem)] leading-[0.68] tracking-[-0.085em]">EsteeHouse</motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="mt-9 flex flex-col gap-4 text-[9px] uppercase tracking-[0.25em] sm:flex-row sm:items-center sm:justify-between">
              <span>Two ways of making. One house.</span><span className="animate-pulse">Scroll to explore ↓</span>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="grid min-h-[65vh] items-end gap-10 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28">
        <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">The idea / 01</p>
        <div>
          <p className="max-w-4xl font-serif text-[clamp(3rem,7vw,7.5rem)] leading-[0.88] tracking-[-0.06em]">Different materials.<br />Different moods.<br /><i>One house.</i></p>
          <p className="mt-10 max-w-xl text-sm leading-7 text-black/55">EsteeHouse brings together pieces that are made to be worn, carried and remembered. EsteeGold is our refined side. EsteeBags is our handmade, expressive side.</p>
        </div>
      </section>

      <CollectionPanel number="1" name="EsteeGold" subtitle="Jewelry / accessories" href="/gold" image="/images/Hero-bg-2.jpg">Jewelry and accessories designed around detail, proportion and the small moments that make an object feel personal.</CollectionPanel>
      <CollectionPanel number="2" name="EsteeBags" subtitle="Handmade / paracord / knit" href="/bags" image="/images/Hero-bg-3.jpg">Handmade bags with color, texture and visible personality. Each piece should look like it was made by someone, not by a machine.</CollectionPanel>

      <section className="relative grid min-h-[78vh] items-center gap-10 overflow-hidden bg-[#e8e1d5] px-5 py-20 md:grid-cols-[0.7fr_1.3fr] md:px-10">
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-black/10 md:h-[30rem] md:w-[30rem]" />
        <div className="relative"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">Made by hand / 02</p><p className="mt-8 max-w-md text-sm leading-7 text-black/55">We want the material to stay visible. The knot, the shine, the irregularity, the tiny difference between one piece and the next.</p></div>
        <div className="relative"><p className="font-serif text-[clamp(4rem,10vw,11rem)] leading-[0.76] tracking-[-0.075em]">Keep the<br /><i>character.</i></p></div>
      </section>

      <section className="bg-black px-5 py-24 text-white md:px-10 md:py-32">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div><p className="text-[9px] uppercase tracking-[0.28em] text-white/35">Explore the house</p><h2 className="mt-5 max-w-3xl font-serif text-[clamp(3.5rem,8vw,9rem)] leading-[0.8] tracking-[-0.07em]">Find your piece.</h2></div>
          <Link href="/categories" className="group flex w-fit items-center gap-4 border-b border-white/30 pb-3 text-[9px] uppercase tracking-[0.25em]">Explore all products <span className="transition-transform duration-300 group-hover:translate-x-2">→</span></Link>
        </div>
      </section>
    </div>
  );
}
