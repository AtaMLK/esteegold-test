"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/app/_lib/cartStore";

export default function CheckoutPage() {
  const { items, hydrated, hydrate, total } = useCartStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", province: "", city: "", postalCode: "" });

  useEffect(() => { hydrate(); }, [hydrate]);

  const update = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  if (!hydrated) return <main className="min-h-screen grid place-items-center">Loading checkout…</main>;
  if (!items.length && !submitted) return <main className="min-h-screen grid place-items-center text-center"><div><p className="text-xs uppercase tracking-[.2em] text-black/40">Checkout</p><h1 className="mt-4 font-serif text-6xl">Your bag is empty.</h1><Link className="mt-8 inline-flex items-center gap-2 border-b border-black/30 pb-2 text-xs uppercase tracking-[.16em]" href="/product">Explore collection <ArrowUpRight size={14} /></Link></div></main>;

  if (submitted) return <main className="min-h-screen bg-[#191915] text-[#f3f0e9] grid place-items-center text-center px-6"><div><Check className="mx-auto mb-6" size={38} /><p className="text-xs uppercase tracking-[.2em] text-white/40">Request received</p><h1 className="mt-4 font-serif text-6xl">Thank you.</h1><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/55">Your order details have been prepared. We will confirm availability and the final payment/shipping steps with you.</p><Link href="/" className="mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-2 text-xs uppercase tracking-[.16em]">Back home <ArrowUpRight size={14} /></Link></div></main>;

  return (
    <main className="min-h-screen bg-[#f3f0e9] text-[#171714] px-[6vw] py-28">
      <div className="flex items-center justify-between border-b border-black/15 pb-6"><Link href="/cart" className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em]"><ArrowLeft size={14} /> Back to bag</Link><span className="text-[9px] uppercase tracking-[.2em] text-black/40">ESTEE GOLD STUDIO / CHECKOUT</span></div>
      <div className="grid gap-14 lg:grid-cols-[1fr_360px] mt-10">
        <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="max-w-2xl">
          <p className="text-[9px] uppercase tracking-[.22em] text-black/45">01 / DELIVERY</p>
          <h1 className="mt-3 font-serif text-6xl leading-[.85]">Where should<br />we send it?</h1>
          <div className="grid gap-5 sm:grid-cols-2 mt-10">
            {[["name","Full name"],["email","Email"],["address","Address"],["province","Province"],["city","City"],["postalCode","Postal code"]].map(([name,label]) => <label key={name} className={name === "address" ? "sm:col-span-2" : ""}><span className="mb-2 block text-[9px] uppercase tracking-[.15em] text-black/45">{label}</span><input required name={name} value={form[name]} onChange={update} className="w-full border-b border-black/25 bg-transparent py-3 outline-none focus:border-black" /></label>)}
          </div>
          <button className="mt-10 min-h-14 w-full bg-[#191915] text-[#f3f0e9] text-[10px] uppercase tracking-[.17em]">Place order request <ArrowUpRight className="inline ml-2" size={14} /></button>
        </form>
        <aside className="h-fit bg-[#191915] text-[#f3f0e9] p-7 lg:sticky lg:top-24">
          <p className="text-[9px] uppercase tracking-[.2em] text-white/40">Your selection</p>
          <div className="mt-7 space-y-4">{items.map((item) => <div key={item.id} className="flex justify-between gap-4 text-sm"><span>{item.name} × {item.quantity}</span><strong className="font-normal">€{(item.price * item.quantity).toFixed(2)}</strong></div>)}</div>
          <div className="mt-7 border-t border-white/20 pt-5 flex justify-between font-serif text-xl"><span>Total</span><strong className="font-normal">€{total().toFixed(2)}</strong></div>
          <p className="mt-5 text-[9px] leading-5 text-white/35">Payment is not collected on this step. We confirm availability and final shipping/payment details before charging the order.</p>
        </aside>
      </div>
    </main>
  );
}
