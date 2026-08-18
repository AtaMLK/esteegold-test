import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "EsteeBags — Handmade Bags | EsteeHouse",
  description: "Explore handmade paracord and knitted bags from EsteeBags by EsteeHouse.",
};

export default function EsteeBagsPage() {
  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-[#201f1c] text-white">
        <Image src="/images/menu-bg.jpg" alt="EsteeBags handmade collection" fill priority className="object-cover opacity-80" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="relative z-10 w-full p-5 pb-12 md:p-10 md:pb-16">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/55">EsteeHouse / 02 / New branch</p>
          <h1 className="mt-5 font-serif text-[clamp(5rem,14vw,14rem)] leading-[0.7] tracking-[-0.08em]">EsteeBags</h1>
          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-sm leading-6 text-white/70">Handmade paracord and knitted bags with color, texture and visible personality.</p>
            <Link href="/categories?branch=bags" className="w-fit border-b border-white/40 pb-2 text-[9px] uppercase tracking-[0.25em]">Shop EsteeBags →</Link>
          </div>
        </div>
      </section>
      <section className="grid gap-10 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28">
        <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">Made by hand</p>
        <div>
          <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.82] tracking-[-0.06em]">Texture you can<br /><i>see and feel.</i></h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-black/55">EsteeBags is a new EsteeHouse branch for handmade paracord and knitted bags. The construction is part of the design — knots, color, hardware and small variations stay visible.</p>
        </div>
      </section>
    </div>
  );
}
