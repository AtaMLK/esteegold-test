"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { use, useState } from "react";
import { useCart } from "../../context/cartContext";

const PRODUCTS = {
  "1": { id: "1", name: "Essential Ring", branch: "EsteeGold", price: 69, image: "/images/Products-page/Ring.jpg", description: "A refined everyday piece with a simple silhouette and handmade character." },
  "2": { id: "2", name: "Layered Set", branch: "EsteeGold", price: 118, image: "/images/Products-page/Combinations.jpg", description: "A considered combination designed to be worn together or separately." },
  "3": { id: "3", name: "Statement Earrings", branch: "EsteeGold", price: 48, image: "/images/Products-page/Earrings.jpg", description: "Light-catching earrings with a confident, sculptural profile." },
  "4": { id: "4", name: "Hand Combination", branch: "EsteeGold", price: 92, image: "/images/Products-page/hand combinations.jpg", description: "A coordinated bracelet and ring composition for a stronger look." },
  "5": { id: "5", name: "Classic Earrings", branch: "EsteeGold", price: 39.99, image: "/images/Products-page/Earrings-2.jpg", description: "An understated pair made for everyday wear." },
  "6": { id: "6", name: "Everyday Bracelet", branch: "EsteeGold", price: 59, image: "/images/Products-page/Bracelets.jpg", description: "A tactile bracelet with a clean, versatile finish." },
};

export default function ProductId({ params }) {
  const { productsId } = use(params);
  const product = PRODUCTS[productsId] || PRODUCTS["1"];
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function addToCart() {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <Link href="/categories" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/45 hover:text-black"><ArrowLeft size={14} /> Back to collection</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="relative min-h-[65vh] overflow-hidden bg-[#d7d0c3] md:min-h-[78vh]">
            <Image src={product.image} alt={product.name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" />
          </div>
          <div className="flex flex-col justify-center py-5">
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">{product.branch} / {product.id.padStart(2, "0")}</p>
            <h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.76] tracking-[-0.065em]">{product.name}</h1>
            <p className="mt-8 max-w-lg text-sm leading-7 text-black/55">{product.description}</p>
            <div className="mt-8 border-y border-black/10 py-6"><p className="text-3xl tracking-[-0.03em]">€{product.price.toFixed(2)}</p><p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-black/40">Taxes and shipping calculated at checkout</p></div>

            <div className="mt-8 flex items-center justify-between border-b border-black/15 pb-4"><span className="text-[9px] uppercase tracking-[0.22em]">Quantity</span><div className="flex items-center gap-5"><button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={15} /></button><span className="w-5 text-center text-sm">{quantity}</span><button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity"><Plus size={15} /></button></div></div>

            <button type="button" onClick={addToCart} className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white transition hover:translate-y-[-1px]"> <ShoppingBag size={15} /> {added ? "Added to bag" : "Add to bag"}</button>
            <Link href="/shipping" className="mt-5 text-center text-[9px] uppercase tracking-[0.2em] text-black/45 underline underline-offset-4">Shipping & returns</Link>
          </div>
        </div>

        <section className="mt-20 border-t border-black/10 pt-10 md:mt-32 md:grid md:grid-cols-[0.35fr_1fr] md:gap-10"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">The EsteeHouse approach</p><p className="max-w-3xl font-serif text-[clamp(2rem,4vw,4.5rem)] leading-[0.9] tracking-[-0.05em]">Objects should feel made, not manufactured.</p></section>
      </div>
    </main>
  );
}
