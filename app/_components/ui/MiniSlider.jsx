"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const pieces = [
  { name: "EsteeGold / Signature", image: "/images/Hero-bg-1.jpg", href: "/categories" },
  { name: "EsteeGold / Form", image: "/images/Hero-bg-2.jpg", href: "/categories" },
  { name: "EsteeBags / Paracord", image: "/images/Hero-bg-3.jpg", href: "/bags" },
  { name: "EsteeBags / Knit", image: "/images/Hero-bg-4.jpg", href: "/bags" },
];

export default function MiniSlider() {
  return (
    <div className="relative px-1 py-6 md:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pieces.map((piece, index) => (
          <Link key={piece.name} href={piece.href} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#ece8df]">
              <img src={piece.image} alt={piece.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 text-white">
                <div>
                  <p className="text-[9px] uppercase tracking-[.22em] text-white/65">0{index + 1} / Collection</p>
                  <h3 className="mt-1 font-serif text-2xl leading-none">{piece.name}</h3>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40"><ArrowUpRight size={15} /></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
