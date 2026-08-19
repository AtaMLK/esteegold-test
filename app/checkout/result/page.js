"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../context/cartContext";

function ResultContent() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const status = params.get("status");
  const success = status === "success";
  const review = status === "review";
  const order = params.get("order");

  useEffect(() => {
    if (success) clearCart();
  }, [success, clearCart]);

  const title = success ? "Thank you." : review ? "Payment received." : "Payment failed.";
  const message = success
    ? `Your payment was verified and your order has been recorded.${order ? ` Order ${order}.` : ""}`
    : review
      ? "The payment was verified, but the order could not be finalized automatically. Do not place a second payment; the order requires review."
      : "The payment could not be verified. No successful payment should be treated as an order.";

  return (
    <div className="max-w-2xl">
      <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">EsteeHouse / Payment</p>
      <h1 className="mt-6 font-serif text-[clamp(4rem,10vw,10rem)] leading-[0.72] tracking-[-0.07em]">{title}</h1>
      <p className="mx-auto mt-8 max-w-md text-sm leading-7 text-black/50">{message}</p>
      {order && success && <div className="mx-auto mt-8 w-fit rounded-full border border-black/10 px-5 py-3 text-[9px] uppercase tracking-[0.2em]">Order {order}</div>}
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={success ? "/profile" : "/checkout"} className="rounded-full bg-black px-7 py-4 text-[9px] uppercase tracking-[0.25em] text-white">{success ? "View my orders" : "Try again"}</Link>
        <Link href="/categories" className="rounded-full border border-black/15 px-7 py-4 text-[9px] uppercase tracking-[0.25em]">Continue shopping</Link>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  return <main className="grid min-h-[75vh] place-items-center bg-[var(--paper)] px-5 py-32 text-center"><Suspense fallback={<p className="text-[9px] uppercase tracking-[0.25em] text-black/40">Checking payment...</p>}><ResultContent /></Suspense></main>;
}
