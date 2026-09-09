"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, Heart, LogOut, Package, RefreshCw, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../_lib/supabase";
import { useUser } from "../context/userContext";
import { useWishlist } from "../context/wishlistContext";

const steps = ["paid", "processing", "shipped", "delivered"];
const labels = { paid: "Confirmed", processing: "Preparing", shipped: "Shipped", delivered: "Delivered" };
function progress(status) { if (["canceled", "payment_failed", "pending_payment"].includes(status)) return -1; return Math.max(0, steps.indexOf(status)); }
function money(value, currency = "EUR") { return new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(value || 0)); }

export default function ProfilePage() {
  const { user, logout } = useUser();
  const { count } = useWishlist();
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

  if (checkingRole) return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-28 md:px-10 md:pt-32"><div className="mx-auto max-w-[1200px] py-24 text-[9px] uppercase tracking-[.3em] text-black/40"><RefreshCw size={14} className="mr-2 inline animate-spin"/> Opening your space…</div></main>;

  return <main className="min-h-screen bg-[var(--paper)] px-5 pb-28 pt-28 md:px-10 md:pt-32">
    <div className="mx-auto max-w-[1200px]">
      <header className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-[1fr_auto] md:items-end md:pb-16"><div><p className="text-[9px] uppercase tracking-[.32em] text-black/40">EsteeHouse / Private space</p><h1 className="mt-5 font-serif text-[clamp(4rem,9vw,9rem)] leading-[.72] tracking-[-.08em]">Your<br/><i>pieces.</i></h1></div><div className="md:text-right"><p className="text-xs text-black/50">{user?.email || "Member"}</p><button onClick={logout} className="mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[.2em] text-black/45 hover:text-black"><LogOut size={14}/> Sign out</button></div></header>
      <nav className="grid grid-cols-2 border-b border-black/10 md:grid-cols-4"><Link href="/profile" className="border-r border-black/10 px-3 py-5 text-[9px] uppercase tracking-[.2em] md:px-5">Orders <span className="ml-1 text-black/35">{orders.length}</span></Link><Link href="/wishlist" className="border-r border-black/10 px-3 py-5 text-[9px] uppercase tracking-[.2em] md:px-5">Saved <span className="ml-1 text-black/35">{count}</span></Link><Link href="/categories" className="px-3 py-5 text-[9px] uppercase tracking-[.2em] md:border-r md:border-black/10 md:px-5">Continue shopping</Link><Link href="/contact" className="border-t border-black/10 px-3 py-5 text-[9px] uppercase tracking-[.2em] md:border-t-0 md:px-5">Need us <ArrowUpRight className="ml-1 inline" size={12}/></Link></nav>

      <section className="mt-14"><div className="mb-7 flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.28em] text-black/40">01 / Order history</p><h2 className="mt-3 font-serif text-4xl tracking-[-.04em]">Everything you keep.</h2></div><Link href="/categories" className="hidden text-[9px] uppercase tracking-[.2em] text-black/45 md:block">Shop the house →</Link></div>
      {error && <div className="border border-black/10 px-4 py-4 text-sm text-black/60">{error}</div>}
      {loading ? <div className="py-20 text-[9px] uppercase tracking-[.3em] text-black/40"><RefreshCw size={14} className="mr-2 inline animate-spin"/> Loading orders…</div> : orders.length === 0 && !error ? <div className="grid min-h-[32vh] place-items-center border border-black/10 text-center"><div><Package size={24} className="mx-auto text-black/25"/><p className="mt-4 font-serif text-3xl">No orders yet.</p><Link href="/categories" className="mt-5 inline-block text-[9px] uppercase tracking-[.2em] underline underline-offset-4">Find your first piece</Link></div></div> : <div className="space-y-3">{orders.map((order) => { const index = progress(order.status), isOpen = open === order.id; return <article key={order.id} className="border border-black/10 bg-white/15"><button type="button" onClick={() => setOpen(isOpen ? null : order.id)} className="grid w-full gap-4 p-5 text-left md:grid-cols-[1fr_auto_auto] md:items-center md:p-7"><div><p className="text-[8px] uppercase tracking-[.2em] text-black/35">{new Date(order.created_at).toLocaleDateString()} · {order.payment_status}</p><h3 className="mt-2 font-serif text-2xl md:text-3xl">{order.order_number}</h3></div><p className="font-serif text-xl">{money(order.total, order.currency)}</p><span className="md:pl-4">{isOpen ? <ChevronUp size={17}/> : <ChevronDown size={17}/>}</span></button>{isOpen && <div className="border-t border-black/10 p-5 md:p-7"><div className="mb-10 grid gap-4 sm:grid-cols-4">{index < 0 ? <div className="text-sm text-black/50">This order is {order.status.replaceAll("_", " ")}.</div> : steps.map((step, i) => <div key={step}><div className={`h-px ${i <= index ? "bg-black" : "bg-black/15"}`}/><p className="mt-3 text-[8px] uppercase tracking-[.16em]">{labels[step]}</p>{i === index && <p className="mt-1 text-xs text-black/40">Current</p>}</div>)}</div><div className="divide-y divide-black/10">{(order.commerce_order_items || []).map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-serif text-lg">{item.product_name_snapshot}</p><p className="mt-1 text-[9px] uppercase tracking-[.14em] text-black/35">{item.product_line} · Qty {item.quantity}</p></div><p className="text-sm">{money(item.line_total, order.currency)}</p></div>)}</div><div className="mt-7 grid gap-7 border-t border-black/10 pt-7 md:grid-cols-2"><div><p className="text-[8px] uppercase tracking-[.2em] text-black/35">Delivery</p><p className="mt-2 text-sm leading-6">{order.address_snapshot?.address || "—"}<br/>{order.address_snapshot?.city || ""} {order.address_snapshot?.postalCode || ""}</p></div><div className="text-sm"><p>Subtotal <span className="float-right">{money(order.subtotal, order.currency)}</span></p><p className="mt-2">Discount <span className="float-right">−{money(order.discount_total, order.currency)}</span></p><p className="mt-2">Shipping <span className="float-right">{money(order.shipping_total, order.currency)}</span></p><p className="mt-3 border-t border-black/10 pt-3">Total <span className="float-right">{money(order.total, order.currency)}</span></p></div></div></div>}</article>; })}</div>}
      </section>
      <section className="mt-20 grid gap-8 border-t border-black/10 pt-10 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-[9px] uppercase tracking-[.28em] text-black/40">02 / Saved pieces</p><h2 className="mt-3 font-serif text-4xl">Keep what catches you.</h2><p className="mt-3 max-w-lg text-sm leading-7 text-black/50">Save a piece while you think. Your saved collection stays on this device and is always one click away.</p></div><Link href="/wishlist" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[.2em]">Open saved pieces <Heart size={14}/></Link></section>
    </div>
  </main>;
}
