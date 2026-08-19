"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { supabase } from "../../_lib/supabase";

const statuses = [
  "all",
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "canceled",
  "payment_failed",
];
const blankShipment = {
  carrier: "",
  tracking_number: "",
  tracking_url: "",
  shipped_at: "",
  estimated_delivery_at: "",
  delivered_at: "",
  notes: "",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]),
    [status, setStatus] = useState("all"),
    [query, setQuery] = useState(""),
    [open, setOpen] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [shipment, setShipment] = useState(blankShipment),
    [savingShipment, setSavingShipment] = useState(false);
  async function request(url, options = {}) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token)
      throw new Error("Please sign in as an administrator.");
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }
  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await request("/api/admin/orders", { cache: "no-store" });
      const shipments = await request("/api/admin/shipments", {
        cache: "no-store",
      });
      const byOrder = new Map(
        (shipments.shipments || []).map((s) => [s.order_id, s]),
      );
      setOrders(
        (data.orders || []).map((o) => ({
          ...o,
          shipment: byOrder.get(o.id) || null,
        })),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  const visible = useMemo(
    () =>
      orders.filter((o) => {
        const customer = o.customer_snapshot || {};
        const haystack =
          `${o.order_number} ${customer.email || ""} ${customer.fullName || ""}`.toLowerCase();
        return (
          (status === "all" || o.status === status) &&
          haystack.includes(query.toLowerCase())
        );
      }),
    [orders, status, query],
  );
  async function updateStatus(id, next) {
    try {
      await request("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  function openOrder(order) {
    const next = open === order.id ? null : order.id;
    setOpen(next);
    if (next) setShipment({ ...blankShipment, ...(order.shipment || {}) });
  }
  async function saveShipment(orderId) {
    setSavingShipment(true);
    setError("");
    try {
      await request("/api/admin/shipments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, ...shipment }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingShipment(false);
    }
  }
  const money = (value, currency = "EUR") =>
    new Intl.NumberFormat("en", { style: "currency", currency }).format(
      Number(value || 0),
    );
  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              EsteeHouse / Admin
            </p>
            <h1 className="mt-4 font-serif text-6xl tracking-[-0.06em] md:text-8xl">
              Orders.
            </h1>
            <p className="mt-4 text-sm text-black/45">
              Payment, customer, address, item snapshots and fulfillment status.
            </p>
          </div>
          <button
            onClick={load}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 px-5 py-3 text-[9px] uppercase tracking-[.2em]"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </header>
        <section className="flex flex-col gap-4 border-b border-black/10 py-5 md:flex-row md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statuses.map((item) => (
              <button
                key={item}
                onClick={() => setStatus(item)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-[8px] uppercase tracking-[.16em] ${status === item ? "bg-black text-white" : "border-black/15"}`}
              >
                {item.replaceAll("_", " ")}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 border-b border-black/15 pb-2 text-sm">
            <Search size={14} className="text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Order, name or email"
              className="bg-transparent outline-none"
            />
          </label>
        </section>
        {error && (
          <div className="mt-5 rounded-xl border border-red-900/10 bg-red-50 px-4 py-3 text-sm text-red-900">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center gap-3 py-24 text-sm text-black/45">
            <RefreshCw size={15} className="animate-spin" /> Loading orders…
          </div>
        ) : visible.length === 0 ? (
          <div className="grid min-h-[35vh] place-items-center text-center">
            <ShoppingBag size={28} className="text-black/20" />
            <p className="mt-4 font-serif text-3xl">No orders found.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {visible.map((order) => {
              const customer = order.customer_snapshot || {},
                address = order.address_snapshot || {},
                isOpen = open === order.id;
              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-black/10 bg-white/25"
                >
                  <button
                    onClick={() => openOrder(order)}
                    className="grid w-full gap-4 p-5 text-left md:grid-cols-[1.2fr_1fr_.7fr_.7fr_auto] md:items-center"
                  >
                    <div>
                      <p className="text-[8px] uppercase tracking-[.2em] text-black/35">
                        Order
                      </p>
                      <p className="mt-1 font-serif text-2xl">
                        {order.order_number}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[.2em] text-black/35">
                        Customer
                      </p>
                      <p className="mt-1 text-sm">
                        {customer.fullName || customer.email || "Guest"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[.2em] text-black/35">
                        Payment
                      </p>
                      <p className="mt-1 text-xs uppercase">
                        {order.payment_status}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-[.2em] text-black/35">
                        Total
                      </p>
                      <p className="mt-1 text-sm">
                        {money(order.total, order.currency)}
                      </p>
                    </div>
                    <div className="justify-self-end">
                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-black/10 px-5 pb-6 pt-5">
                      <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
                        <div>
                          <p className="text-[8px] uppercase tracking-[.2em] text-black/35">
                            Items
                          </p>
                          <div className="mt-3 divide-y divide-black/10">
                            {(order.items || []).map((item) => (
                              <div
                                key={item.id}
                                className="grid grid-cols-[1fr_auto] gap-4 py-4"
                              >
                                <div>
                                  <p className="font-serif text-xl">
                                    {item.product_name_snapshot}
                                  </p>
                                  <p className="mt-1 text-xs text-black/45">
                                    {item.product_line} · Qty {item.quantity}
                                    {item.unit_discount
                                      ? ` · −${Number(item.unit_discount).toFixed(2)} each`
                                      : ""}
                                  </p>
                                </div>
                                <p className="text-sm">
                                  {money(item.line_total, order.currency)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 border-t border-black/10 pt-6">
                            <p className="text-[8px] uppercase tracking-[.2em] text-black/35">
                              Customer snapshot
                            </p>
                            <p className="mt-2 text-sm">
                              {customer.fullName || "—"}
                              <br />
                              {customer.email || "—"}
                              <br />
                              {customer.phone || "—"}
                            </p>
                            <p className="mt-5 text-[8px] uppercase tracking-[.2em] text-black/35">
                              Address snapshot
                            </p>
                            <p className="mt-2 text-sm">
                              {address.address || "—"}
                              <br />
                              {address.city || ""} {address.postalCode || ""}
                            </p>
                          </div>
                        </div>
                        <div className="rounded-2xl border border-black/10 p-5">
                          <div className="flex items-center gap-2">
                            <Truck size={16} />
                            <p className="font-serif text-2xl">Shipment</p>
                          </div>
                          <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <Field
                              label="Carrier"
                              value={shipment.carrier}
                              onChange={(v) =>
                                setShipment((s) => ({ ...s, carrier: v }))
                              }
                            />
                            <Field
                              label="Tracking number"
                              value={shipment.tracking_number}
                              onChange={(v) =>
                                setShipment((s) => ({
                                  ...s,
                                  tracking_number: v,
                                }))
                              }
                            />
                            <Field
                              label="Tracking URL"
                              type="url"
                              value={shipment.tracking_url}
                              onChange={(v) =>
                                setShipment((s) => ({ ...s, tracking_url: v }))
                              }
                            />
                            <Field
                              label="Shipped"
                              type="datetime-local"
                              value={
                                shipment.shipped_at
                                  ? shipment.shipped_at.slice(0, 16)
                                  : ""
                              }
                              onChange={(v) =>
                                setShipment((s) => ({
                                  ...s,
                                  shipped_at: v
                                    ? new Date(v).toISOString()
                                    : null,
                                }))
                              }
                            />
                            <Field
                              label="Estimated delivery"
                              type="datetime-local"
                              value={
                                shipment.estimated_delivery_at
                                  ? shipment.estimated_delivery_at.slice(0, 16)
                                  : ""
                              }
                              onChange={(v) =>
                                setShipment((s) => ({
                                  ...s,
                                  estimated_delivery_at: v
                                    ? new Date(v).toISOString()
                                    : null,
                                }))
                              }
                            />
                            <Field
                              label="Delivered"
                              type="datetime-local"
                              value={
                                shipment.delivered_at
                                  ? shipment.delivered_at.slice(0, 16)
                                  : ""
                              }
                              onChange={(v) =>
                                setShipment((s) => ({
                                  ...s,
                                  delivered_at: v
                                    ? new Date(v).toISOString()
                                    : null,
                                }))
                              }
                            />
                          </div>
                          <label className="mt-4 block text-[8px] uppercase tracking-[.18em] text-black/45">
                            Internal notes
                            <textarea
                              value={shipment.notes || ""}
                              onChange={(e) =>
                                setShipment((s) => ({
                                  ...s,
                                  notes: e.target.value,
                                }))
                              }
                              rows={3}
                              className="mt-2 w-full rounded-xl border border-black/10 bg-transparent p-3 text-sm normal-case tracking-normal outline-none"
                            />
                          </label>
                          <button
                            onClick={() => saveShipment(order.id)}
                            disabled={savingShipment}
                            className="mt-5 w-full rounded-full bg-black px-5 py-3 text-[8px] uppercase tracking-[.22em] text-white disabled:opacity-40"
                          >
                            {savingShipment ? "Saving…" : "Save shipment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="text-[8px] uppercase tracking-[.18em] text-black/45">
      {label}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-black/15 bg-transparent py-2 text-sm normal-case tracking-normal outline-none focus:border-black"
      />
    </label>
  );
}
