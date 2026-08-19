"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../context/cartContext";

export default function CheckoutPage() {
  const { items, subtotal, unitPrice } = useCart();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedShipping, setAcceptedShipping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const canContinue = acceptedTerms && acceptedShipping && !submitting && items.length > 0;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canContinue) return;
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id, quantity, options }) => ({ id, quantity, options })),
          customer: { fullName: form.get("fullName"), email: form.get("email"), phone: form.get("phone"), identityNumber: form.get("identityNumber") },
          address: { address: form.get("address"), city: form.get("city"), postalCode: form.get("postalCode"), country: "Turkey" },
          acceptedTerms,
          acceptedShipping,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment could not be initialized.");
      window.location.assign(data.paymentPageUrl);
    } catch (submissionError) {
      setError(submissionError.message || "Payment could not be initialized.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.65fr]">
          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-black/10 bg-white/30 p-6 md:p-10">
            <p className="text-[9px] uppercase tracking-[0.28em] text-black/40">EsteeHouse / Checkout</p>
            <h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.78] tracking-[-0.06em]">Your details.</h1>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {[["fullName", "Full name", "Your name"], ["email", "Email", "you@example.com"], ["phone", "Phone", "+90"], ["identityNumber", "Identity number", "Your ID number"], ["city", "City", "City"], ["postalCode", "Postal code", "Postal code"]].map(([id, label, placeholder]) => <label key={id} className="text-[9px] uppercase tracking-[0.18em] text-black/50">{label}<input id={id} name={id} required type={id === "email" ? "email" : "text"} placeholder={placeholder} className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none transition focus:border-black" /></label>)}
              <label className="text-[9px] uppercase tracking-[0.18em] text-black/50 sm:col-span-2">Address<input required name="address" placeholder="Street, building, apartment" className="mt-2 w-full border-b border-black/20 bg-transparent px-0 py-3 text-sm normal-case tracking-normal outline-none focus:border-black" /></label>
            </div>
            <div className="mt-12 border-t border-black/10 pt-8">
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-black/40">Before you continue</p>
              <label className="flex cursor-pointer gap-3 text-sm leading-6 text-black/65"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1 h-4 w-4 accent-black" /><span>I have read and agree to the <Link href="/terms" target="_blank" className="underline underline-offset-4">Terms of Use</Link>.</span></label>
              <label className="mt-4 flex cursor-pointer gap-3 text-sm leading-6 text-black/65"><input type="checkbox" checked={acceptedShipping} onChange={(event) => setAcceptedShipping(event.target.checked)} className="mt-1 h-4 w-4 accent-black" /><span>I have read and agree to the <Link href="/shipping" target="_blank" className="underline underline-offset-4">Shipping & Delivery Terms</Link>.</span></label>
            </div>
            {error && <div role="alert" className="mt-6 rounded-xl border border-red-900/10 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>}
            <button type="submit" disabled={!canContinue} className="mt-10 w-full rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-30">{submitting ? "Opening secure payment..." : "Continue to secure payment"}</button>
            <p className="mt-4 text-center text-[9px] uppercase tracking-[0.18em] text-black/35">Your card details are entered on the iyzico hosted payment page.</p>
          </form>
          <aside className="lg:sticky lg:top-28 lg:h-fit"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">Order summary</p><div className="mt-5 rounded-[2rem] bg-black p-7 text-white md:p-9"><p className="font-serif text-4xl tracking-[-0.04em]">Your bag</p><div className="mt-7 space-y-3">{items.map((item) => <div key={item.key} className="flex justify-between gap-5 text-sm"><span className="text-white/55">{item.name} × {item.quantity}</span><span>€{(unitPrice(item) * item.quantity).toFixed(2)}</span></div>)}</div><div className="my-7 border-t border-white/10" /><div className="flex justify-between"><span className="text-white/50">Subtotal</span><span>€{subtotal.toFixed(2)}</span></div><Link href="/cart" className="mt-10 inline-block border-b border-white/30 pb-2 text-[9px] uppercase tracking-[0.24em]">Back to bag →</Link></div></aside>
        </div>
      </div>
    </main>
  );
}
