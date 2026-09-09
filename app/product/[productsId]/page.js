"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";
import ProductGallery from "../../_components/ui/product-gallery";
import WishlistButton from "../../_components/ui/wishlist-button";

function finalPrice(product) { const price = Number(product.regional_price?.amount ?? product.price_eur ?? product.price ?? 0); const discount = Number(product.discount_percent || 0); return Math.max(0, price - price * discount / 100); }
function currencySymbol(currency) { return currency === "TRY" ? "₺" : currency === "USD" ? "$" : "€"; }

export default function ProductId({ params }) {
  const { productsId } = use(params), { addItem } = useCart();
  const [product, setProduct] = useState(null), [related, setRelated] = useState([]), [quantity, setQuantity] = useState(1), [added, setAdded] = useState(false), [loading, setLoading] = useState(true), [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const response = await fetch(`/api/catalog?ids=${encodeURIComponent(productsId)}`, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Product unavailable");
        const found = data.products?.[0];
        if (!found) throw new Error("Product not found");
        if (cancelled) return;
        setProduct(found);
        try {
          const recent = JSON.parse(window.localStorage.getItem("esteehouse-recent") || "[]").map(String).filter((id) => id !== String(found.id));
          window.localStorage.setItem("esteehouse-recent", JSON.stringify([String(found.id), ...recent].slice(0, 8)));
        } catch {}
        const branchQuery = new URLSearchParams({ branch: found.branch });
        const relatedResponse = await fetch(`/api/catalog?${branchQuery}`, { cache: "no-store" });
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          const candidates = (relatedData.products || []).filter((item) => String(item.id) !== String(found.id));
          const sameCategory = candidates.filter((item) => item.category === found.category);
          setRelated([...sameCategory, ...candidates.filter((item) => item.category !== found.category)].slice(0, 4));
        }
      } catch (requestError) { if (!cancelled) setError(requestError.message); }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [productsId]);

  function addToCart() { if (!product) return; addItem({ ...product, price: finalPrice(product), currency: product.regional_price?.currency || "EUR" }, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }
  if (loading) return <main className="min-h-screen bg-[var(--paper)] px-5 pb-24 pt-36 md:px-10"><p className="text-[9px] uppercase tracking-[0.25em] text-black/40">Loading piece...</p></main>;
  if (error || !product) return <main className="grid min-h-screen place-items-center bg-[var(--paper)] px-5 text-center"><div><p className="font-serif text-5xl">Piece not found.</p><p className="mt-3 text-sm text-black/45">{error || "This product is no longer available."}</p><Link href="/categories" className="mt-8 inline-block rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white">Back to shop</Link></div></main>;

  const price = finalPrice(product), regional = product.regional_price || { currency: "EUR", amount: Number(product.price || 0) }, discounted = Number(product.discount_percent || 0) > 0, story = product.story || "I wanted this piece to feel personal rather than overworked. The shape is kept clear, the material is allowed to show itself, and the small differences are part of why it belongs here.", symbol = currencySymbol(regional.currency), internationalUsd = Number(product.price_usd || 0);
  return <main className="min-h-screen bg-[var(--paper)] px-5 pb-28 pt-28 md:px-10 md:pt-32"><div className="mx-auto max-w-7xl">
    <Link href="/categories" className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-black/45 hover:text-black"><ArrowLeft size={14}/> Back to collection</Link>
    <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20"><ProductGallery product={product}/><div className="flex flex-col justify-center py-5"><div className="flex items-center justify-between gap-4"><p className="text-[9px] uppercase tracking-[0.3em] text-black/40">{product.branch} / {product.category}</p><WishlistButton productId={product.id}/></div><h1 className="mt-5 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.76] tracking-[-0.065em]">{product.name}</h1><p className="mt-8 max-w-lg text-sm leading-7 text-black/55">{product.description || "A piece from the EsteeHouse collection, made to carry its own character."}</p><div className="mt-8 border-y border-black/10 py-6">{discounted && <p className="text-sm text-black/35 line-through">{symbol}{regional.amount.toFixed(2)}</p>}<p className="text-3xl tracking-[-0.03em]">{symbol}{price.toFixed(2)}</p>{regional.region === "INTL" && <p className="mt-2 text-sm text-black/45">Reference: ${internationalUsd.toFixed(2)} USD</p>}{regional.region === "TR" && <p className="mt-2 text-sm text-black/45">International: €{Number(product.price_eur || 0).toFixed(2)} · ${internationalUsd.toFixed(2)}</p>}{discounted && <p className="mt-2 text-[9px] uppercase tracking-[0.2em]">{product.discount_percent}% house offer</p>}<p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-black/40">{regional.currency} pricing · taxes and shipping calculated at checkout</p></div><div className="mt-8 flex items-center justify-between border-b border-black/15 pb-4"><span className="text-[9px] uppercase tracking-[0.22em]">Quantity</span><div className="flex items-center gap-5"><button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={15}/></button><span className="w-5 text-center text-sm">{quantity}</span><button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity"><Plus size={15}/></button></div></div><button type="button" onClick={addToCart} className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-black px-6 py-4 text-[9px] uppercase tracking-[0.25em] text-white transition hover:translate-y-[-1px]"><ShoppingBag size={15}/> {added ? "Added to bag" : "Add to bag"}</button><Link href="/shipping" className="mt-5 text-center text-[9px] uppercase tracking-[0.2em] text-black/45 underline underline-offset-4">Shipping & returns</Link></div></div>
    <section className="mt-20 grid gap-10 border-t border-black/10 pt-10 md:mt-32 md:grid-cols-[0.35fr_1fr] md:gap-10"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">The story / {product.name}</p><div><p className="max-w-3xl font-serif text-[clamp(2.4rem,4.5vw,5rem)] leading-[0.9] tracking-[-0.05em]">Made slowly. Kept for a reason.</p><p className="mt-8 max-w-2xl text-base leading-8 text-black/60">{story}</p></div></section>
    {related.length > 0 && <section className="mt-24 border-t border-black/10 pt-10 md:mt-32"><div className="flex items-end justify-between gap-6"><div><p className="text-[9px] uppercase tracking-[.28em] text-black/40">Continue through the house</p><h2 className="mt-3 font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[.82] tracking-[-.06em]">A few more<br/><i>to consider.</i></h2></div><Link href={`/categories?branch=${product.branch === "EsteeGold" ? "gold" : "bags"}`} className="hidden items-center gap-2 text-[9px] uppercase tracking-[.2em] md:flex">View all <ArrowRight size={14}/></Link></div><div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">{related.map((item, index) => { const itemImage = item.image_url || item.media?.find((m) => m.kind === "image")?.url || "/images/Hero-bg-1.jpg"; const itemCurrency = item.regional_price?.currency || "EUR"; const itemSymbol = currencySymbol(itemCurrency); const itemPrice = finalPrice(item); return <Link href={`/product/${item.id}`} key={item.id} className="group"><div className={`relative overflow-hidden bg-[#d8d1c4] ${index === 1 ? "aspect-[.86] md:mt-8" : "aspect-[.78]"}`}><Image src={itemImage} alt={item.name} fill unoptimized={itemImage.startsWith("http")} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-[1.04]"/><div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-12 text-white"><p className="text-[7px] uppercase tracking-[.18em] text-white/55">{item.category}</p><p className="mt-1 font-serif text-xl">{item.name}</p></div></div><div className="mt-3 flex justify-between text-[9px] text-black/45"><span>Explore</span><span>{itemSymbol}{itemPrice.toFixed(2)}</span></div></Link>; })}</div></section>}
    <section className="mt-20 border-t border-black/10 pt-10 md:mt-28 md:grid md:grid-cols-[0.35fr_1fr] md:gap-10"><p className="text-[9px] uppercase tracking-[0.28em] text-black/40">The EsteeHouse approach</p><p className="max-w-3xl font-serif text-[clamp(2rem,4vw,4.5rem)] leading-[0.9] tracking-[-0.05em]">Objects should feel made, not manufactured.</p></section>
  </div></main>;
}
