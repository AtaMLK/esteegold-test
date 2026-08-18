"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutResultPage() {
  const params = useSearchParams();
  const success = params.get("status") === "success";

  return (
    <main className="grid min-h-[75vh] place-items-center bg-[var(--paper)] px-5 py-32 text-center">
      <div className="max-w-2xl">
        <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">EsteeHouse / Payment</p>
        <h1 className="mt-6 font-serif text-[clamp(4rem,10vw,10rem)] leading-[0.72] tracking-[-0.07em]">{success ? "Thank you." : "Payment failed."}</h1>
        <p className="mx-auto mt-8 max-w-md text-sm leading-7 text-black/50">{success ? "Your payment was verified by iyzico. The order-record creation and fulfillment pipeline will be attached to this verified payment next." : "The payment could not be verified. No successful payment should be treated as an order."}</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"><Link href={success ? "/" : "/checkout"} className="rounded-full bg-black px-7 py-4 text-[9px] uppercase tracking-[0.25em] text-white">{success ? "Back to EsteeHouse" : "Try again"}</Link><Link href="/categories" className="rounded-full border border-black/15 px-7 py-4 text-[9px] uppercase tracking-[0.25em]">Continue shopping</Link></div>
      </div>
    </main>
  );
}
