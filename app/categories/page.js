"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const products = [
  { id: "1", name: "Essential Ring", branch: "EsteeGold", category: "Rings", price: 69, image: "/images/Products-page/Ring.jpg" },
  { id: "2", name: "Layered Set", branch: "EsteeGold", category: "Sets", price: 118, image: "/images/Products-page/Combinations.jpg" },
  { id: "3", name: "Statement Earrings", branch: "EsteeGold", category: "Earrings", price: 48, image: "/images/Products-page/Earrings.jpg" },
  { id: "4", name: "Hand Combination", branch: "EsteeGold", category: "Bracelets", price: 92, image: "/images/Products-page/hand combinations.jpg" },
  { id: "5", name: "Classic Earrings", branch: "EsteeGold", category: "Earrings", price: 39.99, image: "/images/Products-page/Earrings-2.jpg" },
  { id: "6", name: "Everyday Bracelet", branch: "EsteeGold", category: "Bracelets", price: 59, image: "/images/Products-page/Bracelets.jpg" },
];

export default function CategoriesPage() {
  const [branch, setBranch] = useState("all");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setBranch(params.get("branch") || "all");
  }, []);

  const visible = useMemo(() => products.filter((product) => (branch === "all" || product.branch.toLowerCase().includes(branch.toLowerCase())) && (category === "all" || product.category === category)), [branch, category]);
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category)))];

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div><p className="text-[9px] uppercase tracking-[0.3em] text-black/40">The shop / {branch === "all" ? "All collections" : branch}</p><h1 className="mt-5 font-serif text-[clamp(4.5rem,11vw,11rem)] leading-[0.7] tracking-[-0.075em]">Find your<br /><i>piece.</i></h1></div>
          <p className="max-w-md text-sm leading-7 text-black/50">Explore the EsteeHouse collection. Choose a branch or category, then open a piece to see its details and add it to your bag.</p>
        </section>

        <section className="flex flex-col gap-4 border-b border-black/10 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2"><Link href="/categories" onClick={() => setBranch("all")} className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === "all" ? "bg-black text-white" : "border-black/15"}`}>All</Link><Link href="/categories?branch=gold" onClick={() => setBranch("gold")} className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === "gold" ? "bg-black text-white" : "border-black/15"}`}>EsteeGold</Link><Link href="/categories?branch=bags" onClick={() => setBranch("bags")} className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === "bags" ? "bg-black text-white" : "border-black/15"}`}>EsteeBags</Link></div>
          <label className="flex items-center gap-3 text-[8px] uppercase tracking-[0.2em] text-black/45"><SlidersHorizontal size={13} /><select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent outline-none"><option value="all">All categories</option>{categories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        </section>

        {visible.length === 0 ? <section className="grid min-h-[45vh] place-items-center text-center"><div><p className="font-serif text-4xl">Coming next.</p><p className="mt-3 text-sm text-black/45">The EsteeBags catalog is ready for its product data and photography.</p></div></section> : <section className="grid gap-x-5 gap-y-16 py-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map((product, index) => <Link href={`/product/${product.id}`} key={product.id} className={`group ${index % 3 === 1 ? "lg:translate-y-12" : ""}`}><div className="relative aspect-[0.78] overflow-hidden bg-[#d7d0c3]"><Image src={product.image} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/75 p-4 text-white backdrop-blur-sm transition duration-500 group-hover:translate-y-0"><div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"><span>View piece</span><ArrowRight size={13} /></div></div></div><div className="mt-4 flex items-start justify-between gap-5"><div><p className="text-[8px] uppercase tracking-[0.2em] text-black/35">{product.branch} / {product.category}</p><h2 className="mt-2 font-serif text-2xl tracking-[-0.035em]">{product.name}</h2></div><p className="text-sm">€{product.price.toFixed(2)}</p></div></Link>)}</section>}
      </div>
    </main>
  );
}
