"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package, RefreshCw } from "lucide-react";
import { supabase } from "../_lib/supabase";

const steps = ["paid", "processing", "shipped", "delivered"];
const labels = { paid: "Payment confirmed", processing: "Preparing", shipped: "Shipped", delivered: "Delivered" };
function progress(status) { if (["canceled", "payment_failed", "pending_payment"].includes(status)) return -1; return Math.max(0, steps.indexOf(status)); }

export default function ProfilePage() {
  const [orders, setOrders] = useState([]), [open, setOpen] = useState(null), [loading, setLoading] = useState(true), [checkingRole, setCheckingRole] = useState(true), [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function start() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { if (!cancelled) { setError("Please sign in to see your orders."); setLoading(false); setCheckingRole(false); } return; }
      try {
        const adminResponse = await fetch("/api/admin/me", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
        if (adminResponse.ok) { window.location.replace("/admin"); return; }
      } catch {}
      if (!cancelled) setCheckingRole(false);
      try {
        const response = await fetch("/api/account/orders", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load your orders.");
        if (!cancelled) setOrders(data.orders || []);
      } catch (e) { if (!cancelled) setError(e.message); }
      finally { if (!cancelled) setLoading(false); }
    }
    start();
    return () => { cancelled = true; };
  }, []);

  const money = (value, currency = "EUR") => new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value || 0));
  if (checkingRole) return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10"><div className="mx-auto max-w-5xl"><div className="flex items-center gap-3 py-24 text-sm text-black/40"><RefreshCw size={15} className="animate-spin"/> Opening your account…</div></div></main>;

  return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10"><div className="mx-auto max-w-5xl"><header className="border-b border-black/10 pb-8"><p className="text-[9px] uppercase tracking-[.3em] text-black/40">EsteeHouse / Account</p><h1 className="mt-4 font-serif text-6xl tracking-[-.06em] md:text-8xl">My orders.</h1><p className="mt-4 text-sm text-black/45">Follow every purchase from payment to delivery.</p></header>{error && <div className="mt-6 rounded-xl bg-black/[.04] px-4 py-3 text-sm">{error}</div>}{loading ? <div className="flex items-center gap-3 py-24 text-sm text-black/45"><RefreshCw size={15} className="animate-spin"/> Loading your orders…</div> : orders.length === 0 && !error ? <div className="grid min-h-[35vh] place-items-center text-center"><Package size={28} className="text-black/20"/><p className="mt-4 font-serif text-3xl">No orders yet.</p></div> : <div className="mt-8 space-y-4">{orders.map((order) => { const index = progress(order.status); const isOpen = open === order.id; return <article key={order.id} className="overflow-hidden rounded-3xl border border-black/10"><button onClick={() => setOpen(isOpen ? null : order.id)} className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-7"><div><p className="text-[8px] uppercase tracking-[.2em] text-black/35">{new Date(order.created_at).toLocaleDateString()} · {order.payment_status}</p><h2 className="mt-2 font-serif text-3xl">{order.order_number}</h2></div><div className="text-right"><p className="font-serif text-2xl">{money(order.total, order.currency)}</p>{isOpen ? <ChevronUp className="ml-auto mt-2" size={17}/> : <ChevronDown className="ml-auto mt-2" size={17}/>}</div></button>{isOpen && <div className="border-t border-black/10 p-5 md:p-7"><div className="mb-10">{index < 0 ? <div className="rounded-2xl bg-black/[.04] p-5 text-sm">This order is {order.status.replaceAll("_", " ")}.</div> : <div className="grid gap-6 sm:grid-cols-4">{steps.map((step, i) => <div key={step}><div className={`h-1 rounded-full ${i <= index ? "bg-black" : "bg-black/10"}`}/><p className="mt-3 text-[9px] uppercase tracking-[.15em]">{labels[step]}</p>{i === index && <p className="mt-1 text-xs text-black/40">Current status</p>}</div>)}</div>}</div><div className="divide-y divide-black/10">{(order.commerce_order_items || []).map((item) => <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 py-4"><div><p className="font-serif text-xl">{item.product_name_snapshot}</p><p className="mt-1 text-xs text-black/40">{item.product_line} · Qty {item.quantity}</p></div><p>{money(item.line_total, order.currency)}</p></div>)}</div><div className="mt-6 grid gap-6 border-t border-black/10 pt-6 md:grid-cols-2"><div><p className="text-[8px] uppercase tracking-[.2em] text-black/35">Delivery address</p><p className="mt-2 text-sm">{order.address_snapshot?.address || "—"}<br/>{order.address_snapshot?.city || ""} {order.address_snapshot?.postalCode || ""}</p></div><div className="text-sm"><p>Subtotal <span className="float-right">{money(order.subtotal, order.currency)}</span></p><p className="mt-2">Discount <span className="float-right">−{money(order.discount_total, order.currency)}</span></p><p className="mt-2">Shipping <span className="float-right">{money(order.shipping_total, order.currency)}</span></p><p className="mt-3 border-t border-black/10 pt-3 font-medium">Total <span className="float-right">{money(order.total, order.currency)}</span></p></div></div></div>}</article>; })}</div>}</div></main>;
}
