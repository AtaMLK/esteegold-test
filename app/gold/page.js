import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "EsteeGold — Jewelry & Accessories | EsteeHouse",
  description: "Explore EsteeGold jewelry and accessories from EsteeHouse.",
};

export default function EsteeGoldPage() {
  return (
    <div className="bg-[var(--paper)] text-[var(--ink)]">
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-black text-white">
        <Image src="/images/Hero-bg-2.jpg" alt="EsteeGold jewelry collection" fill priority className="object-cover opacity-75" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="relative z-10 w-full p-5 pb-12 md:p-10 md:pb-16">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/55">EsteeHouse / 01</p>
          <h1 className="mt-5 font-serif text-[clamp(5rem,14vw,14rem)] leading-[0.7] tracking-[-0.08em]">EsteeGold</h1>
          <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <p className="max-w-lg text-sm leading-6 text-white/70">Jewelry and accessories shaped around detail, proportion and personal expression.</p>
            <Link href="/categories?branch=gold" className="w-fit border-b border-white/40 pb-2 text-[9px] uppercase tracking-[0.25em]">Shop EsteeGold →</Link>
          </div>
        </div>
      </section>
      <section className="grid gap-10 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28">
        <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">The collection</p>
        <div>
          <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] leading-[0.82] tracking-[-0.06em]">Quiet pieces.<br /><i>Strong character.</i></h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-black/55">Explore the current EsteeGold collection and discover the pieces that belong in your everyday rotation.</p>
        </div>
      </section>
    </div>
  );
}
