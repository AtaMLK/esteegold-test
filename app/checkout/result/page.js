"use client";

import { useAppearance } from "../../context/appearanceContext";

import Link from "../../_components/ui/localized-link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../context/cartContext";

function ResultContent() {
  const { translateText } = useAppearance();
  const params = useSearchParams();
  const { clearCart } = useCart();
  const status = params.get("status");
  const success = status === "success";
  const review = status === "review";
  const order = params.get("order");

  useEffect(() => {
    if (success) clearCart();
  }, [success, clearCart]);

  const title = success ? translateText("Thank you.") : review ? translateText("Payment received.") : translateText("Payment failed.");
  const message = success
    ? `${translateText("Your payment was verified and your order has been recorded.", "Ödemeniz doğrulandı ve siparişiniz kaydedildi.")}${order ? ` ${translateText("Order")} ${order}.` : ""}`
    : review
      ? translateText("The payment was verified, but the order could not be finalized automatically. Do not place a second payment; the order requires review.")
      : translateText("The payment could not be verified. No successful payment should be treated as an order.");

  return (
    <div className="max-w-2xl">
      <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">{translateText("EsteeHouse / Payment")}</p>
      <h1 className="mt-6 font-serif text-[clamp(4rem,10vw,10rem)] leading-[0.72] tracking-[-0.07em]">{title}</h1>
      <p className="mx-auto mt-8 max-w-md text-sm leading-7 text-black/50">{message}</p>
      {order && success && <div className="mx-auto mt-8 w-fit rounded-full border border-black/10 px-5 py-3 text-[9px] uppercase tracking-[0.2em]">{translateText("Order")} {order}</div>}
      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={success ? "/profile" : "/checkout"} className="rounded-full bg-black px-7 py-4 text-[9px] uppercase tracking-[0.25em] text-white">{success ? translateText("View my orders") : translateText("Try again")}</Link>
        <Link href="/categories" className="rounded-full border border-black/15 px-7 py-4 text-[9px] uppercase tracking-[0.25em]">{translateText("Continue shopping")}</Link>
      </div>
    </div>
  );
}

export default function CheckoutResultPage() {
  const { translateText } = useAppearance();
  return <main className="grid min-h-[75vh] place-items-center bg-[var(--paper)] px-5 py-32 text-center"><Suspense fallback={<p className="text-[9px] uppercase tracking-[0.25em] text-black/40">{translateText("Checking payment...")}</p>}><ResultContent /></Suspense></main>;
}
