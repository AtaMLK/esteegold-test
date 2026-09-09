"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import WishlistButton from "../_components/ui/wishlist-button";
import { useWishlist } from "../context/wishlistContext";

export default function WishlistPage() {
  const { ids, count, clear } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ids.length) { setProducts([]); return; }
    setLoading(true);
    fetch(`/api/catalog?ids=${ids.map(encodeURIComponent).join(",")}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { products: [] })
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [ids]);

  return <main className="min-h-screen bg-[var(--paper)] px-5 pb-28 pt-28 md:px-10 md:pt-32"><div className="mx-auto max-w-[1200px]">
    <header className="grid gap-8 border-b border-black/10 pb-12 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-[9px] uppercase tracking-[.32em] text-black/40">EsteeHouse / Saved pieces</p><h1 className="mt-5 font-serif text-[clamp(4rem,9vw,9rem)] leading-[.72] tracking-[-.08em]">Things<br/><i>to keep.</i></h1></div><div className="text-right"><p className="font-serif text-3xl">{count}</p><p className="mt-1 text-[8px] uppercase tracking-[.2em] text-black/40">saved pieces</p>{count > 0 && <button onClick={clear} className="mt-5 inline-flex items-center gap-2 text-[8px] uppercase tracking-[.2em] text-black/45 hover:text-black"><Trash2 size={12}/> Clear all</button>}</div></header>
    {loading ? <div className="py-24 text-[9px] uppercase tracking-[.3em] text-black/40">Opening your saved collection…</div> : !products.length ? <section className="grid min-h-[45vh] place-items-center text-center"><div><Heart size={25} className="mx-auto text-black/25"/><p className="mt-5 font-serif text-4xl">Nothing saved yet.</p><p className="mt-3 max-w-sm text-sm leading-7 text-black/45">When a piece catches you, tap the heart. It will stay here while you decide.</p><Link href="/categories" className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[8px] uppercase tracking-[.2em] text-white">Explore the collection <ArrowRight size={13}/></Link></div></section> : <section className="grid grid-cols-2 gap-x-4 gap-y-14 pt-12 md:grid-cols-3 md:gap-x-6 md:gap-y-20 md:pt-16">{products.map((product, index) => { const image = product.image_url || product.media?.find((m) => m.kind === "image")?.url || "/images/Hero-bg-1.jpg"; const currency = product.regional_price?.currency || "EUR"; const symbol = currency === "TRY" ? "₺" : currency === "USD" ? "$" : "€"; const price = Number(product.regional_price?.amount ?? product.price_eur ?? product.price ?? 0); return <Link href={`/product/${product.id}`} key={product.id} className="group"><div className={`relative overflow-hidden bg-[#d8d1c4] ${index % 3 === 1 ? "aspect-[.88] md:mt-10" : "aspect-[.78]"}`}><Image src={image} alt={product.name} fill unoptimized={image.startsWith("http")} sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-[1.04]"/><div className="absolute right-3 top-3"><WishlistButton productId={product.id} compact/></div><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-12 text-white"><p className="text-[7px] uppercase tracking-[.2em] text-white/60">{product.branch} / {product.category}</p><h2 className="mt-1 font-serif text-2xl tracking-[-.03em]">{product.name}</h2></div></div><div className="mt-3 flex justify-between gap-3 text-[10px]"><span className="text-black/40">Saved for later</span><span>{symbol}{price.toFixed(2)}</span></div></Link>; })}</section>}
  </div></main>;
}
