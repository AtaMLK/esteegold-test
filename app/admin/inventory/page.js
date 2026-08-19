"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Warehouse, Plus } from "lucide-react";
import { supabase } from "../../_lib/supabase";
import { useError } from "../../context/errorContext";

export default function InventoryPage() {
  const { reportError } = useError();
  const [rows, setRows] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adjust, setAdjust] = useState(null);
  const [delta, setDelta] = useState("");
  const [reason, setReason] = useState("");

  async function req(url, opt = {}) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("Please sign in as an administrator.");

    const response = await fetch(url, {
      ...opt,
      headers: {
        ...(opt.headers || {}),
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) throw new Error(data.error || "Request failed.");
    return data;
  }

  async function load() {
    setLoading(true);
    setError("");

    try {
      const data = await req("/api/admin/inventory", { cache: "no-store" });
      setRows(data.inventory || []);
      setLedger(data.ledger || []);
    } catch (e) {
      setError(reportError(e, "Could not load inventory."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const search = q.trim().toLowerCase();
    if (!search) return rows;

    return rows.filter((row) =>
      `${row.product_name || ""} ${row.product_id || ""}`
        .toLowerCase()
        .includes(search)
    );
  }, [rows, q]);

  async function save() {
    try {
      await req("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: adjust.product_id,
          delta: Number(delta),
          reason,
        }),
      });

      setAdjust(null);
      setDelta("");
      setReason("");
      await load();
    } catch (e) {
      setError(reportError(e, "Could not adjust inventory."));
    }
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex justify-between border-b border-black/10 pb-8">
          <div>
            <p className="text-[9px] uppercase tracking-[.3em] text-black/40">EsteeHouse / Admin</p>
            <h1 className="mt-4 font-serif text-6xl md:text-8xl">Inventory.</h1>
            <p className="mt-4 text-sm text-black/45">Live stock plus an immutable movement ledger.</p>
          </div>
          <button
            type="button"
            onClick={load}
            className="h-fit rounded-full border border-black/15 p-3"
            aria-label="Refresh inventory"
          >
            <RefreshCw size={14} />
          </button>
        </header>

        {error && (
          <div role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-900">
            {error}
          </div>
        )}

        <div className="mt-7 flex justify-between">
          <label className="flex gap-2 border-b border-black/15 pb-2 text-sm">
            <Search size={14} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search product"
              className="bg-transparent outline-none"
            />
          </label>
        </div>

        {loading ? (
          <div className="py-20 text-sm text-black/45">Loading…</div>
        ) : (
          <>
            <section className="mt-7 overflow-x-auto rounded-2xl border border-black/10">
              <table className="w-full min-w-[650px] text-left">
                <thead className="border-b border-black/10 text-[8px] uppercase tracking-[.2em] text-black/40">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th>Available</th>
                    <th>Reserved</th>
                    <th>Total</th>
                    <th>Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center font-serif text-2xl text-black/45">
                        No inventory found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => (
                      <tr key={row.product_id} className="border-b border-black/5">
                        <td className="px-5 py-4">
                          <div className="font-serif text-xl">{row.product_name}</div>
                          <div className="mt-1 text-[9px] uppercase tracking-[.12em] text-black/30">
                            {row.product_id}
                          </div>
                        </td>
                        <td>{row.available_quantity}</td>
                        <td>{row.reserved_quantity}</td>
                        <td>{Number(row.available_quantity) + Number(row.reserved_quantity)}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setAdjust(row)}
                            className="rounded-full border p-2"
                            aria-label={`Adjust ${row.product_name}`}
                          >
                            <Plus size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>

            <section className="mt-10">
              <div className="flex items-center gap-2">
                <Warehouse size={16} />
                <h2 className="font-serif text-3xl">Movement history</h2>
              </div>

              <div className="mt-4 overflow-x-auto rounded-2xl border border-black/10">
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className="border-b border-black/10 text-[8px] uppercase tracking-[.2em] text-black/40">
                    <tr>
                      <th className="px-5 py-4">Time</th>
                      <th>Product</th>
                      <th>Change</th>
                      <th>Reason</th>
                      <th>Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((item) => (
                      <tr key={item.id} className="border-b border-black/5">
                        <td className="px-5 py-4">{new Date(item.created_at).toLocaleString()}</td>
                        <td>
                          <div>{item.product_name}</div>
                          <div className="mt-1 text-[9px] text-black/30">{item.product_id}</div>
                        </td>
                        <td>{item.quantity_delta > 0 ? `+${item.quantity_delta}` : item.quantity_delta}</td>
                        <td>{item.reason}</td>
                        <td>{item.order_id || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {adjust && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-5">
            <div className="w-full max-w-md rounded-3xl bg-[var(--paper)] p-7">
              <p className="text-[8px] uppercase tracking-[.2em] text-black/40">Inventory adjustment</p>
              <h2 className="mt-2 font-serif text-3xl">{adjust.product_name}</h2>
              <p className="mt-2 text-[9px] text-black/35">{adjust.product_id}</p>

              <input
                type="number"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                placeholder="+10 or -2"
                className="mt-6 w-full border-b p-3 outline-none"
              />
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason"
                className="mt-4 w-full border-b p-3 outline-none"
              />

              <div className="mt-6 flex gap-2">
                <button type="button" onClick={() => setAdjust(null)} className="flex-1 rounded-full border p-3">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={!Number.isInteger(Number(delta)) || !reason.trim()}
                  className="flex-1 rounded-full bg-black p-3 text-white disabled:opacity-30"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
