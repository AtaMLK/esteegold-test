"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/cartContext";

export default function CartPage() {
  const { items, ready, subtotal, updateQuantity, removeItem } = useCart();

  if (!ready) return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-36 md:px-10"><p className="text-[9px] uppercase tracking-[0.25em] text-black/40">Loading your bag...</p></main>;

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between border-b border-black/10 pb-8"><div><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">EsteeHouse / Bag</p><h1 className="mt-5 font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.72] tracking-[-0.07em]">Your bag.</h1></div><span className="text-[9px] uppercase tracking-[0.2em] text-black/40">{items.length} {items.length === 1 ? "line" : "lines"}</span></div>

        {items.length === 0 ? (
          <section className="grid min-h-[55vh] place-items-center text-center"><div><p className="font-serif text-4xl tracking-[-0.04em]">Nothing here yet.</p><p className="mt-4 text-sm text-black/50">Find something you want to keep.</p><Link href="/categories" className="mt-8 inline-flex items-center gap-3 rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white">Explore products <ArrowRight size={14} /></Link></div></section>
        ) : (
          <div className="grid gap-12 py-10 lg:grid-cols-[1fr_0.35fr] lg:gap-20">
            <div className="divide-y divide-black/10">
              {items.map((item) => (
                <article key={item.key} className="grid grid-cols-[88px_1fr_auto] gap-4 py-6 sm:grid-cols-[120px_1fr_auto] sm:gap-6">
                  <Link href={`/product/${item.id}`} className="relative aspect-[0.85] overflow-hidden bg-[#d7d0c3]"><Image src={item.image} alt={item.name} fill className="object-cover" sizes="120px" /></Link>
                  <div className="min-w-0"><p className="text-[8px] uppercase tracking-[0.22em] text-black/35">{item.branch}</p><Link href={`/product/${item.id}`} className="mt-2 block font-serif text-2xl tracking-[-0.035em] hover:underline">{item.name}</Link><p className="mt-2 text-sm text-black/50">€{Number(item.price).toFixed(2)}</p><div className="mt-5 flex w-fit items-center gap-4 border-b border-black/15 pb-2"><button onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity"><Minus size={13} /></button><span className="w-5 text-center text-xs">{item.quantity}</span><button onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity"><Plus size={13} /></button></div></div>
                  <div className="flex flex-col items-end justify-between"><p className="text-sm">€{(Number(item.price) * item.quantity).toFixed(2)}</p><button onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name}`} className="text-black/35 transition hover:text-black"><Trash2 size={17} /></button></div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-[2rem] bg-black p-7 text-white md:p-9 lg:sticky lg:top-28"><p className="text-[9px] uppercase tracking-[0.28em] text-white/35">Summary</p><div className="mt-8 flex justify-between text-sm"><span className="text-white/50">Subtotal</span><span>€{subtotal.toFixed(2)}</span></div><div className="mt-3 flex justify-between text-sm"><span className="text-white/50">Shipping</span><span className="text-white/50">Calculated next</span></div><div className="my-7 border-t border-white/10" /><div className="flex justify-between"><span className="font-serif text-2xl">Total</span><span className="font-serif text-2xl">€{subtotal.toFixed(2)}</span></div><Link href="/checkout" className="mt-8 flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-black">Continue to checkout <ArrowRight size={14} /></Link><Link href="/categories" className="mt-5 block text-center text-[9px] uppercase tracking-[0.2em] text-white/40">Continue shopping</Link></aside>
          </div>
        )}
      </div>
    </main>
  );
}
