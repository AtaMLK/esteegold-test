"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Package, ShoppingBag, Users, WalletCards, RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "../_lib/supabase";

const statusLabel = {
  pending_payment: "Pending payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  canceled: "Canceled",
  payment_failed: "Payment failed",
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please sign in as an administrator.");
      const headers = { Authorization: `Bearer ${session.access_token}` };
      const [ordersResponse, catalogResponse] = await Promise.all([
        fetch("/api/admin/orders", { headers, cache: "no-store" }),
        fetch("/api/admin/catalog", { headers, cache: "no-store" }),
      ]);
      const ordersData = await ordersResponse.json();
      const catalogData = await catalogResponse.json();
      if (!ordersResponse.ok) throw new Error(ordersData.error || "Could not load orders.");
      if (!catalogResponse.ok) throw new Error(catalogData.error || "Could not load catalog.");
      setOrders(ordersData.orders || []);
      setProducts(catalogData.products || []);
    } catch (e) {
      setError(e.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "canceled");
    const paidOrders = orders.filter((o) => ["paid", "processing", "shipped", "delivered"].includes(o.status));
    const customers = new Set();
    orders.forEach((o) => {
      const c = o.customer_snapshot || {};
      customers.add((c.email || c.phone || c.fullName || o.id).toLowerCase());
    });
    return {
      products: products.length,
      activeProducts: products.filter((p) => p.active).length,
      lowStock: products.filter((p) => p.active && Number(p.stock || 0) <= 2).length,
      orders: orders.length,
      pending: orders.filter((o) => ["pending_payment", "paid", "processing"].includes(o.status)).length,
      revenue: paidOrders.reduce((sum, o) => sum + Number(o.total || 0), 0),
      customers: customers.size,
      validOrders: validOrders.length,
    };
  }, [orders, products]);

  const recentOrders = orders.slice(0, 6);

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-28 pt-10 md:px-10 md:pt-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[.3em] text-black/40">EsteeHouse / Back office</p>
            <h1 className="mt-4 font-serif text-6xl tracking-[-.06em] md:text-8xl">Dashboard.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/45">Your store at a glance — sales, orders, customers, catalog and stock.</p>
          </div>
          <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-[9px] uppercase tracking-[.2em]">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </header>

        {error && <div className="mt-6 rounded-2xl border border-red-900/10 bg-red-50 px-5 py-4 text-sm text-red-900">{error}</div>}

        <section className="grid gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          <Stat label="Revenue" value={`€${stats.revenue.toFixed(2)}`} icon={<WalletCards size={16} />} />
          <Stat label="Orders" value={stats.orders} meta={`${stats.pending} need attention`} icon={<ShoppingBag size={16} />} />
          <Stat label="Customers" value={stats.customers} icon={<Users size={16} />} />
          <Stat label="Products" value={stats.activeProducts} meta={`${stats.lowStock} low stock`} icon={<Package size={16} />} />
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_.75fr]">
          <div className="rounded-2xl border border-black/10 p-5 md:p-7">
            <div className="flex items-end justify-between border-b border-black/10 pb-5">
              <div><p className="text-[8px] uppercase tracking-[.25em] text-black/40">Latest activity</p><h2 className="mt-2 font-serif text-3xl">Recent orders.</h2></div>
              <Link href="/admin/orders" className="inline-flex items-center gap-1 text-[8px] uppercase tracking-[.2em]">View all <ArrowUpRight size={12}/></Link>
            </div>
            {loading ? <div className="py-16 text-sm text-black/40">Loading orders…</div> : recentOrders.length === 0 ? <div className="py-16 text-sm text-black/40">No orders yet.</div> : <div className="divide-y divide-black/5">{recentOrders.map((order) => { const customer = order.customer_snapshot || {}; return <Link key={order.id} href="/admin/orders" className="flex items-center justify-between gap-4 py-5 hover:opacity-60"><div className="min-w-0"><div className="font-serif text-xl">{order.order_number || order.id.slice(0, 8)}</div><div className="mt-1 truncate text-xs text-black/40">{customer.fullName || customer.email || "Guest"} · {order.items?.length || 0} item(s)</div></div><div className="text-right"><div className="text-sm">€{Number(order.total || 0).toFixed(2)}</div><div className="mt-1 text-[8px] uppercase tracking-[.15em] text-black/40">{statusLabel[order.status] || order.status}</div></div></Link>; })}</div>}
          </div>

          <div className="space-y-5">
            <QuickLink href="/admin/catalog" eyebrow="Storefront" title="Manage catalog" text={`${stats.products} products · ${stats.activeProducts} active`} />
            <QuickLink href="/admin/orders" eyebrow="Commerce" title="Manage orders" text={`${stats.orders} total orders · ${stats.pending} active`} />
            <QuickLink href="/admin/customers" eyebrow="Customers" title="Customer book" text={`${stats.customers} customers from order snapshots`} />
            <div className="rounded-2xl border border-black/10 p-5">
              <div className="flex items-center gap-2 text-[8px] uppercase tracking-[.2em] text-black/40"><AlertTriangle size={13}/> Inventory watch</div>
              <p className="mt-3 font-serif text-3xl">{stats.lowStock} low-stock.</p>
              <p className="mt-2 text-xs leading-5 text-black/45">Active products with two or fewer units remaining.</p>
              <Link href="/admin/inventory" className="mt-5 inline-flex text-[8px] uppercase tracking-[.2em] underline underline-offset-4">Open inventory</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, meta, icon }) {
  return <div className="bg-[var(--paper)] p-5 md:p-6"><div className="flex items-center justify-between text-black/35"><span className="text-[8px] uppercase tracking-[.2em]">{label}</span>{icon}</div><div className="mt-5 font-serif text-4xl tracking-[-.04em]">{value}</div>{meta && <div className="mt-2 text-[9px] text-black/40">{meta}</div>}</div>;
}

function QuickLink({ href, eyebrow, title, text }) {
  return <Link href={href} className="group block rounded-2xl border border-black/10 p-5 transition hover:-translate-y-0.5 hover:bg-black hover:text-white"><div className="flex items-center justify-between"><span className="text-[8px] uppercase tracking-[.2em] opacity-45">{eyebrow}</span><ArrowUpRight size={14}/></div><h3 className="mt-5 font-serif text-3xl">{title}</h3><p className="mt-2 text-xs opacity-45">{text}</p></Link>;
}
