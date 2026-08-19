"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Package,
  Pencil,
  Power,
  RefreshCw,
  X,
} from "lucide-react";
import { supabase } from "../../_lib/supabase";
import { useError } from "../../context/errorContext";

const EMPTY = {
  name: "",
  branch: "EsteeGold",
  category: "",
  description: "",
  image_url: "",
  price: "",
  discount_percent: "0",
  stock: "0",
  active: true,
};

export default function AdminCatalogPage() {
  const { reportError } = useError();
  const [products, setProducts] = useState([]),
    [query, setQuery] = useState(""),
    [branch, setBranch] = useState("all");
  const [editing, setEditing] = useState(null),
    [form, setForm] = useState(EMPTY),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState("");

  async function adminRequest(url, options = {}) {
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
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok)
      throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await adminRequest("/api/admin/catalog", {
        cache: "no-store",
      });
      setProducts(data.products || []);
    } catch (e) {
      setError(reportError(e, "Could not load the catalog."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);
  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (branch === "all" || p.branch === branch) &&
          `${p.name} ${p.category || ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [products, query, branch],
  );
  function openCreate() {
    setEditing("new");
    setForm(EMPTY);
    setError("");
  }
  function openEdit(product) {
    setEditing(product.id);
    setForm({
      ...EMPTY,
      ...product,
      price: product.price ?? "",
      discount_percent: product.discount_percent ?? 0,
      stock: product.stock ?? 0,
    });
    setError("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await adminRequest("/api/admin/catalog", {
        method: editing === "new" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(editing !== "new" ? { id: editing } : {}),
          ...form,
          price: Number(form.price),
          discount_percent: Number(form.discount_percent || 0),
          stock: Number(form.stock || 0),
        }),
      });
      setEditing(null);
      await load();
    } catch (e) {
      setError(reportError(e, "Could not save this product."));
    } finally {
      setSaving(false);
    }
  }

  async function toggle(product) {
    try {
      await adminRequest("/api/admin/catalog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, active: !product.active }),
      });
      await load();
    } catch (e) {
      setError(reportError(e, "Could not change product visibility."));
    }
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-black/40">
              EsteeHouse / Admin
            </p>
            <h1 className="mt-4 font-serif text-6xl tracking-[-0.06em] md:text-8xl">
              Catalog.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-black/45">
              Manage real storefront products, prices, discounts, inventory and
              branch visibility.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-[9px] uppercase tracking-[0.22em] text-white"
          >
            <Plus size={14} /> Add product
          </button>
        </header>
        <section className="flex flex-col gap-4 border-b border-black/10 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {["all", "EsteeGold", "EsteeBags"].map((item) => (
              <button
                key={item}
                onClick={() => setBranch(item)}
                className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === item ? "bg-black text-white" : "border-black/15"}`}
              >
                {item === "all" ? "All" : item}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 border-b border-black/15 pb-2 text-sm">
            <Search size={14} className="text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="bg-transparent outline-none"
            />
          </label>
        </section>
        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-900/10 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {error}
          </div>
        )}
        <section className="py-8">
          {loading ? (
            <div className="flex items-center gap-3 py-20 text-sm text-black/45">
              <RefreshCw size={15} className="animate-spin" /> Loading catalog…
            </div>
          ) : visible.length === 0 ? (
            <div className="grid min-h-[35vh] place-items-center text-center">
              <Package size={28} className="text-black/20" />
              <p className="mt-4 font-serif text-3xl">No products found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-black/10">
              <table className="w-full min-w-[850px] text-left">
                <thead className="border-b border-black/10 bg-black/[.025] text-[8px] uppercase tracking-[.2em] text-black/40">
                  <tr>
                    <th className="px-5 py-4">Product</th>
                    <th>Branch</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th className="px-5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-black/5 last:border-0"
                    >
                      <td className="px-5 py-4">
                        <div className="font-serif text-xl">{p.name}</div>
                        <div className="mt-1 max-w-xs truncate text-xs text-black/35">
                          {p.description || "No description"}
                        </div>
                      </td>
                      <td className="text-xs">{p.branch}</td>
                      <td className="text-xs">{p.category || "—"}</td>
                      <td className="text-sm">
                        €{Number(p.price || 0).toFixed(2)}
                      </td>
                      <td className="text-sm">
                        {Number(p.discount_percent || 0)}%
                      </td>
                      <td className="text-sm">{p.stock ?? 0}</td>
                      <td>
                        <span
                          className={`rounded-full px-3 py-1 text-[8px] uppercase tracking-[.15em] ${p.active ? "bg-black text-white" : "bg-black/5 text-black/40"}`}
                        >
                          {p.active ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="px-5">
                        <div className="flex gap-2">
                          <button
                            title="Edit"
                            onClick={() => openEdit(p)}
                            className="rounded-full border border-black/10 p-2"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            title={p.active ? "Hide" : "Activate"}
                            onClick={() => toggle(p)}
                            className="rounded-full border border-black/10 p-2"
                          >
                            <Power size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      {editing && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-5"
          onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}
        >
          <form
            onSubmit={save}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-[var(--paper)] p-7 md:p-10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[.25em] text-black/40">
                  {editing === "new" ? "New product" : "Edit product"}
                </p>
                <h2 className="mt-3 font-serif text-4xl">Product details</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-xl text-black/40"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ["name", "Name", "text"],
                ["category", "Category", "text"],
                ["image_url", "Image URL", "url"],
                ["price", "Price (€)", "number"],
                ["discount_percent", "Discount %", "number"],
                ["stock", "Stock", "number"],
              ].map(([key, label, type]) => (
                <label
                  key={key}
                  className="text-[8px] uppercase tracking-[.18em] text-black/45"
                >
                  {label}
                  <input
                    required={["name", "price"].includes(key)}
                    type={type}
                    min={type === "number" ? "0" : undefined}
                    max={key === "discount_percent" ? "100" : undefined}
                    step={
                      key === "discount_percent"
                        ? "1"
                        : key === "price"
                          ? "0.01"
                          : undefined
                    }
                    value={form[key] ?? ""}
                    onChange={(e) =>
                      setForm((v) => ({ ...v, [key]: e.target.value }))
                    }
                    className="mt-2 w-full border-b border-black/15 bg-transparent py-3 text-sm normal-case tracking-normal outline-none focus:border-black"
                  />
                </label>
              ))}
              <label className="text-[8px] uppercase tracking-[.18em] text-black/45">
                Branch
                <select
                  value={form.branch}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, branch: e.target.value }))
                  }
                  className="mt-2 w-full border-b border-black/15 bg-transparent py-3 text-sm normal-case tracking-normal outline-none"
                >
                  <option>EsteeGold</option>
                  <option>EsteeBags</option>
                </select>
              </label>
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.active}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, active: e.target.checked }))
                  }
                />{" "}
                Active in storefront
              </label>
              <label className="text-[8px] uppercase tracking-[.18em] text-black/45 sm:col-span-2">
                Description
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, description: e.target.value }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-transparent p-3 text-sm normal-case tracking-normal outline-none focus:border-black"
                />
              </label>
            </div>
            <button
              disabled={saving}
              className="mt-8 w-full rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[.25em] text-white disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save product"}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
