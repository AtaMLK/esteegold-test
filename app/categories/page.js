"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import WishlistButton from "../_components/ui/wishlist-button";

function money(product) {
  const currency = product.regional_price?.currency || "EUR";
  const symbol = currency === "TRY" ? "₺" : currency === "USD" ? "$" : "€";
  const base = Number(product.regional_price?.amount ?? product.price_eur ?? product.price ?? 0);
  const discount = Number(product.discount_percent || 0);
  return { symbol, list: base, final: Math.max(0, base - base * discount / 100), discounted: discount > 0 };
}

function productImage(product, index = 0) {
  return product.image_url || product.media?.find((m) => m.kind === "image")?.url || `/images/Hero-bg-${(index % 4) + 1}.jpg`;
}

export default function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [branch, setBranch] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCatalog(nextBranch = branch, nextSearch = search) {
    setLoading(true); setError("");
    const query = new URLSearchParams();
    if (nextBranch !== "all") query.set("branch", nextBranch === "gold" ? "EsteeGold" : "EsteeBags");
    if (nextSearch) query.set("search", nextSearch);
    try {
      const response = await fetch(`/api/catalog${query.toString() ? `?${query.toString()}` : ""}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Catalog unavailable");
      setProducts(data.products || []);
    } catch (requestError) { setError(requestError.message || "Catalog unavailable"); setProducts([]); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialBranch = params.get("branch") || "all";
    const initialSearch = params.get("search") || "";
    setBranch(initialBranch); setSearch(initialSearch); setSearchInput(initialSearch);
    loadCatalog(initialBranch, initialSearch);
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))], [products]);
  const visible = useMemo(() => products.filter((p) => category === "all" || p.category === category), [products, category]);

  function chooseBranch(nextBranch) {
    const params = new URLSearchParams();
    if (nextBranch !== "all") params.set("branch", nextBranch);
    if (search) params.set("search", search);
    window.history.pushState({}, "", `/categories${params.toString() ? `?${params}` : ""}`);
    setBranch(nextBranch); setCategory("all"); loadCatalog(nextBranch, search);
  }

  function submitSearch(event) {
    event.preventDefault();
    const value = searchInput.trim();
    const params = new URLSearchParams();
    if (branch !== "all") params.set("branch", branch);
    if (value) params.set("search", value);
    window.history.pushState({}, "", `/categories${params.toString() ? `?${params}` : ""}`);
    setSearch(value); setCategory("all"); loadCatalog(branch, value);
  }

  function clearSearch() {
    setSearchInput(""); setSearch("");
    const params = branch !== "all" ? `?branch=${encodeURIComponent(branch)}` : "";
    window.history.pushState({}, "", `/categories${params}`);
    loadCatalog(branch, "");
  }

  return (
    <main className="min-h-screen bg-[var(--paper)] px-5 pb-28 pt-28 md:px-10 md:pt-32">
      <div className="mx-auto max-w-[1440px]">
        <section className="grid gap-10 border-b border-black/10 pb-12 md:grid-cols-[1.25fr_.75fr] md:items-end md:pb-16">
          <div><p className="text-[9px] uppercase tracking-[.32em] text-black/40">The collection / {branch === "all" ? "House selection" : branch === "gold" ? "EsteeGold" : "EsteeBags"}</p><h1 className="mt-6 max-w-5xl font-serif text-[clamp(4.3rem,11vw,12rem)] leading-[.69] tracking-[-.08em]">Find what<br/><i>stays.</i></h1></div>
          <div className="md:pb-1"><p className="max-w-md text-sm leading-7 text-black/55">A small collection of things made to be worn, carried and kept. Look slowly. The details are where the pieces become yours.</p><Link href="/about" className="mt-7 inline-flex items-center gap-2 text-[9px] uppercase tracking-[.25em]">How the house makes <ArrowUpRight size={14}/></Link></div>
        </section>

        <section className="sticky top-0 z-30 -mx-5 border-b border-black/10 bg-[rgba(243,240,233,.92)] px-5 py-4 backdrop-blur-xl md:-mx-10 md:px-10">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[['all','All'],['gold','EsteeGold'],['bags','EsteeBags']].map(([value,label]) => <button key={value} type="button" onClick={() => chooseBranch(value)} className={`shrink-0 rounded-full border px-5 py-2.5 text-[8px] uppercase tracking-[.2em] transition ${branch === value ? "border-black bg-black text-white" : "border-black/15 hover:border-black/35"}`}>{label}</button>)}
            </div>
            <div className="flex items-center gap-5"><label className="flex shrink-0 items-center gap-2 text-[8px] uppercase tracking-[.2em] text-black/45"><SlidersHorizontal size={13}/><select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent outline-none"><option value="all">All categories</option>{categories.slice(1).map((item) => <option key={item} value={item}>{item}</option>)}</select></label><form onSubmit={submitSearch} className="flex min-w-0 flex-1 items-center gap-2 border-b border-black/20 py-1 lg:w-[360px]"><Search size={15}/><input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search the collection" className="min-w-0 flex-1 bg-transparent py-2 text-[11px] outline-none"/>{searchInput && <button type="button" onClick={clearSearch} aria-label="Clear search"><X size={14}/></button>}<button type="submit" className="text-[8px] uppercase tracking-[.2em]">Search</button></form></div>
          </div>
        </section>

        {search && !loading && <div className="py-5 text-[9px] uppercase tracking-[.2em] text-black/40">Search / “{search}” / {visible.length} pieces</div>}
        {loading ? <section className="grid min-h-[55vh] place-items-center text-[9px] uppercase tracking-[.3em] text-black/35">Opening the collection…</section> : error ? <section className="grid min-h-[55vh] place-items-center text-center"><div><p className="font-serif text-5xl tracking-[-.04em]">The collection is<br/><i>quiet for a moment.</i></p><p className="mt-4 max-w-sm text-sm leading-7 text-black/45">{error}</p><button onClick={() => loadCatalog(branch, search)} className="mt-7 rounded-full bg-black px-6 py-3 text-[8px] uppercase tracking-[.2em] text-white">Try again</button></div></section> : visible.length === 0 ? <section className="grid min-h-[45vh] place-items-center text-center"><div><p className="font-serif text-5xl">Nothing here yet.</p><p className="mt-3 text-sm text-black/45">Try another category or search.</p></div></section> : (
          <section className="grid grid-cols-2 gap-x-3 gap-y-14 pt-10 md:grid-cols-12 md:gap-x-5 md:gap-y-20 md:pt-16">
            {visible.map((product, index) => {
              const price = money(product); const image = productImage(product, index); const feature = index === 0; const wide = index > 0 && index % 7 === 0;
              return <Link key={product.id} href={`/product/${product.id}`} className={`${feature ? "col-span-2 md:col-span-7 md:row-span-2" : wide ? "col-span-2 md:col-span-8" : "col-span-1 md:col-span-5"} group relative block`}>
                <div className={`relative overflow-hidden bg-[#d8d1c4] ${feature ? "aspect-[.92] md:aspect-[.88]" : wide ? "aspect-[1.55]" : "aspect-[.78]"}`}>
                  <Image src={image} alt={product.name} fill unoptimized={image.startsWith("http")} sizes={feature ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 50vw, 42vw"} className="object-cover transition duration-1000 ease-out group-hover:scale-[1.045]"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70"/>
                  <div className="absolute left-3 top-3 flex items-center gap-2 md:left-5 md:top-5"><span className="rounded-full border border-white/40 bg-black/15 px-3 py-1.5 text-[7px] uppercase tracking-[.2em] text-white backdrop-blur">{String(index + 1).padStart(2,"0")}</span>{price.discounted && <span className="rounded-full bg-white px-3 py-1.5 text-[7px] uppercase tracking-[.2em]">-{product.discount_percent}%</span>}</div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white md:bottom-5 md:left-5 md:right-5"><div><p className="text-[7px] uppercase tracking-[.2em] text-white/65">{product.branch} / {product.category}</p><h2 className={`mt-1 font-serif tracking-[-.035em] ${feature ? "text-3xl md:text-6xl" : "text-xl md:text-3xl"}`}>{product.name}</h2></div><WishlistButton productId={product.id} compact/></div>
                </div>
                <div className="mt-3 flex items-start justify-between gap-4"><p className="max-w-[70%] text-[9px] leading-4 text-black/40">{product.description}</p><div className="text-right text-[10px]">{price.discounted && <span className="mr-1 text-black/30 line-through">{price.symbol}{price.list.toFixed(2)}</span>}<span>{price.symbol}{price.final.toFixed(2)}</span></div></div>
              </Link>;
            })}
          </section>
        )}
      </div>
    </main>
  );
}
