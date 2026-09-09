"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function displayPrice(product) {
  const price = Number(product.regional_price?.amount ?? product.price_eur ?? product.price ?? 0);
  const discount = Number(product.discount_percent || 0);
  return Math.max(0, price - price * discount / 100);
}
function symbol(product) { return product.regional_price?.currency === "TRY" ? "₺" : product.regional_price?.currency === "USD" ? "$" : "€"; }

export default function CategoriesPage() {
  const [products, setProducts] = useState([]), [branch, setBranch] = useState("all"), [category, setCategory] = useState("all"), [search, setSearch] = useState(""), [searchInput, setSearchInput] = useState(""), [loading, setLoading] = useState(true), [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextBranch = params.get("branch") || "all", nextSearch = params.get("search") || "";
    setBranch(nextBranch); setSearch(nextSearch); setSearchInput(nextSearch);
    const query = new URLSearchParams();
    if (nextBranch !== "all") query.set("branch", nextBranch === "gold" ? "EsteeGold" : "EsteeBags");
    if (nextSearch) query.set("search", nextSearch);
    setLoading(true); setError("");
    fetch(`/api/catalog${query.toString() ? `?${query.toString()}` : ""}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Catalog unavailable")))
      .then((data) => setProducts(data.products || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function refreshFromUrl() {
    const params = new URLSearchParams(window.location.search), nextBranch = params.get("branch") || "all", nextSearch = params.get("search") || "";
    setBranch(nextBranch); setSearch(nextSearch); setSearchInput(nextSearch); setLoading(true); setError("");
    const query = new URLSearchParams(); if (nextBranch !== "all") query.set("branch", nextBranch === "gold" ? "EsteeGold" : "EsteeBags"); if (nextSearch) query.set("search", nextSearch);
    try { const response = await fetch(`/api/catalog${query.toString() ? `?${query.toString()}` : ""}`); if (!response.ok) throw new Error("Catalog unavailable"); setProducts((await response.json()).products || []); } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  const visible = useMemo(() => products.filter((product) => category === "all" || product.category === category), [products, category]);
  const categories = ["all", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))];
  function submitSearch(event) { event.preventDefault(); const params = new URLSearchParams(); if (branch !== "all") params.set("branch", branch); if (searchInput.trim()) params.set("search", searchInput.trim()); window.history.replaceState({}, "", `/categories${params.toString() ? `?${params.toString()}` : ""}`); setCategory("all"); refreshFromUrl(); }
  function clearSearch() { setSearchInput(""); const params = branch !== "all" ? `?branch=${encodeURIComponent(branch)}` : ""; window.history.replaceState({}, "", `/categories${params}`); refreshFromUrl(); }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-32 md:px-10"><div className="mx-auto max-w-7xl">
      <section className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-[1fr_0.7fr] md:items-end"><div><p className="text-[9px] uppercase tracking-[0.3em] text-black/40">The shop / {branch === "all" ? "All collections" : branch === "gold" ? "EsteeGold" : "EsteeBags"}</p><h1 className="mt-5 font-serif text-[clamp(4.5rem,11vw,11rem)] leading-[0.7] tracking-[-0.075em]">Find your<br/><i>piece.</i></h1></div><p className="max-w-md text-sm leading-7 text-black/50">I make pieces to be worn, carried and lived with. Start with a collection, search by name or material, and take your time.</p></section>
      <section className="flex flex-col gap-5 border-b border-black/10 py-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2"><Link href={`/categories${search ? `?search=${encodeURIComponent(search)}` : ""}`} className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === "all" ? "bg-black text-white" : "border-black/15"}`}>All</Link><Link href={`/categories?branch=gold${search ? `&search=${encodeURIComponent(search)}` : ""}`} className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === "gold" ? "bg-black text-white" : "border-black/15"}`}>EsteeGold</Link><Link href={`/categories?branch=bags${search ? `&search=${encodeURIComponent(search)}` : ""}`} className={`rounded-full border px-4 py-2 text-[8px] uppercase tracking-[0.2em] ${branch === "bags" ? "bg-black text-white" : "border-black/15"}`}>EsteeBags</Link></div><label className="flex items-center gap-3 text-[8px] uppercase tracking-[0.2em] text-black/45"><SlidersHorizontal size={13}/><select value={category} onChange={(event) => setCategory(event.target.value)} className="bg-transparent outline-none"><option value="all">All categories</option>{categories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-black/20 py-2"><Search size={16}/><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search pieces, materials or collections" aria-label="Search products" className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"/>{searchInput && <button type="button" onClick={clearSearch} aria-label="Clear search" className="p-2 text-black/45 hover:text-black"><X size={15}/></button>}<button type="submit" className="rounded-full bg-black px-4 py-2 text-[8px] uppercase tracking-[0.2em] text-white">Search</button></form></section>
      {search && !loading && <p className="pt-6 text-[9px] uppercase tracking-[0.2em] text-black/40">Showing results for “{search}” · {visible.length} pieces</p>}
      {loading ? <section className="grid min-h-[45vh] place-items-center text-[9px] uppercase tracking-[0.25em] text-black/40">Loading the house...</section> : error ? <section className="grid min-h-[45vh] place-items-center text-center"><div><p className="font-serif text-4xl">Catalog unavailable.</p><p className="mt-3 text-sm text-black/45">{error}</p></div></section> : visible.length === 0 ? <section className="grid min-h-[45vh] place-items-center text-center"><div><p className="font-serif text-4xl">Nothing here yet.</p><p className="mt-3 text-sm text-black/45">Try another word or browse the complete collection.</p>{search && <button type="button" onClick={clearSearch} className="mt-6 rounded-full bg-black px-5 py-3 text-[8px] uppercase tracking-[0.2em] text-white">Clear search</button>}</div></section> : <section className="grid gap-x-5 gap-y-16 py-12 sm:grid-cols-2 lg:grid-cols-3">{visible.map((product, index) => { const finalPrice = displayPrice(product), discounted = Number(product.discount_percent || 0) > 0, currentSymbol = symbol(product), listPrice = Number(product.regional_price?.amount ?? product.price_eur ?? product.price ?? 0); return <Link href={`/product/${product.id}`} key={product.id} className={`group ${index % 3 === 1 ? "lg:translate-y-12" : ""}`}><div className="relative aspect-[0.78] overflow-hidden bg-[#d7d0c3]"><Image src={product.image_url || product.media?.find((m) => m.kind === "image")?.url || "/images/Hero-bg-1.jpg"} alt={product.name} fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" unoptimized={product.image_url?.startsWith("http") || product.media?.some((m) => m.url?.startsWith("http"))}/>{discounted && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-[8px] uppercase tracking-[0.18em]">-{product.discount_percent}%</span>}<div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/75 p-4 text-white backdrop-blur-sm transition duration-500 group-hover:translate-y-0"><div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em]"><span>View piece</span><ArrowRight size={13}/></div></div></div><div className="mt-4 flex items-start justify-between gap-5"><div><p className="text-[8px] uppercase tracking-[0.2em] text-black/35">{product.branch} / {product.category}</p><h2 className="mt-2 font-serif text-2xl tracking-[-0.035em]">{product.name}</h2></div><div className="text-right text-sm">{discounted && <p className="text-xs text-black/35 line-through">{currentSymbol}{listPrice.toFixed(2)}</p>}<p>{currentSymbol}{finalPrice.toFixed(2)}</p></div></div></Link>; })}</section>}
    </div></main>
  );
}
