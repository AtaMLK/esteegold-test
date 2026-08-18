"use client";

import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedShipping, setAcceptedShipping] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canContinue = acceptedTerms && acceptedShipping && !submitting;

  function handleSubmit(event) {
    event.preventDefault();
    if (!canContinue) return;
    setSubmitting(true);
    // Payment/order creation will be connected to the server-side order flow.
    // Never send a client-controlled price to the payment provider.
    setTimeout(() => setSubmitting(false), 800);
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-black/10 bg-white/30 p-6 md:p-10">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">EsteeHouse / Checkout</p>
            <h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.78] tracking-[-0.06em]">Your details.</h1>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {[
                ["fullName", "Full name", "Your name"],
                ["email", "Email", "you@example.com"],
                ["phone", "Phone", "+90"],
                ["city", "City", "City"],
              ].map(([id, label, placeholder]) => (
                <label key={id} className="text-[9px] uppercase tracking-[0.18em] text-black/50">
                  {label}
                  <input id={id} name={id} required type={id === "email" ? "email" : "text"} placeholder={placeholder} className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none transition focus:border-black" />
                </label>
              ))}
              <label className="text-[9px] uppercase tracking-[0.18em] text-black/50 sm:col-span-2">Address<input required name="address" placeholder="Street, building, apartment" className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none focus:border-black" /></label>
              <label className="text-[9px] uppercase tracking-[0.18em] text-black/50 sm:col-span-2">Postal code<input required name="postalCode" placeholder="Postal code" className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none focus:border-black" /></label>
            </div>

            <div className="mt-12 border-t border-black/10 pt-8">
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-black/40">Before you continue</p>
              <label className="flex cursor-pointer gap-3 text-sm leading-6 text-black/65">
                <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-black" />
                <span>I have read and agree to the <Link href="/terms" target="_blank" className="underline underline-offset-4">Terms of Use</Link>.</span>
              </label>
              <label className="mt-4 flex cursor-pointer gap-3 text-sm leading-6 text-black/65">
                <input type="checkbox" checked={acceptedShipping} onChange={(event) => setAcceptedShipping(event.target.checked)} className="mt-1 h-4 w-4 accent-black" />
                <span>I have read and agree to the <Link href="/shipping" target="_blank" className="underline underline-offset-4">Shipping & Delivery Terms</Link>.</span>
              </label>
            </div>

            <button type="submit" disabled={!canContinue} className="mt-10 w-full rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-30">
              {submitting ? "Preparing..." : "Continue to secure payment"}
            </button>
            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.18em] text-black/35">Payment amount will be calculated and validated server-side.</p>
          </form>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">Order summary</p>
            <div className="mt-5 rounded-[2rem] bg-black p-7 text-white md:p-9">
              <p className="font-serif text-4xl tracking-[-0.04em]">Your bag</p>
              <p className="mt-6 text-sm leading-6 text-white/55">Your cart items and server-calculated total will appear here. Discounts and historical order prices must always be resolved on the server.</p>
              <Link href="/cart" className="mt-10 inline-block border-b border-white/30 pb-2 text-[9px] uppercase tracking-[0.24em]">Back to bag →</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
