"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useProductStore } from "@/app/_lib/ProductStore";
import { useCartStore } from "@/app/_lib/cartStore";
import "../product.css";

const fallbackImage = "/images/Hero-bg-1.jpg";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading, error, fetchProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = products.find((item) => String(item.id) === String(id));
  const images = useMemo(() => product?.product_images?.length ? product.product_images : [{ image_url: fallbackImage }], [product]);
  const related = useMemo(
    () => products.filter((item) => item.id !== product?.id && String(item.categories?.id) === String(product?.categories?.id)).slice(0, 4),
    [products, product]
  );

  if (loading && !products.length) return <div className="catalog-state">Loading piece…</div>;
  if (error && !products.length) return <div className="catalog-state">{error}</div>;
  if (!product) return <div className="catalog-state">Product not found.</div>;

  const currentImage = images[activeImage]?.image_url || fallbackImage;

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="product-detail-page">
      <div className="product-detail-topbar">
        <Link href="/product" className="flex items-center gap-2"><ArrowLeft size={15} /> Collection</Link>
        <span>{product.categories?.title || "Object"}</span>
      </div>

      <section className="product-detail-hero">
        <div className="product-gallery">
          <div className="product-gallery-main">
            <img src={currentImage} alt={product.name || "Product"} />
            <span>{String(activeImage + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          </div>
          <div className="product-gallery-thumbs">
            {images.map((image, index) => (
              <button key={image.id || index} onClick={() => setActiveImage(index)} className={activeImage === index ? "active" : ""}>
                <img src={image.image_url || fallbackImage} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="product-detail-copy">
          <p className="product-detail-kicker">{product.categories?.title || "ESTEE GOLD OBJECT"}</p>
          <h1>{product.name}</h1>
          <p className="product-detail-description">{product.description || "A considered piece designed around proportion, material and everyday movement."}</p>
          <div className="product-detail-price">€{product.price}</div>

          <div className="product-detail-meta">
            <span>Material</span><strong>{product.material || "Hand finished"}</strong>
            <span>Availability</span><strong>{Number(product.stock) > 0 ? "Ready to ship" : "Made to order"}</strong>
          </div>

          <div className="product-quantity-row">
            <span>Quantity</span>
            <div><button onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={14} /></button><strong>{quantity}</strong><button onClick={() => setQuantity((value) => value + 1)}><Plus size={14} /></button></div>
          </div>

          <button className={`product-add-button ${added ? "added" : ""}`} onClick={handleAdd}>
            {added ? <><Check size={17} /> Added to collection</> : <><ShoppingBag size={17} /> Add to bag</>}
          </button>
          <Link href="/cart" className="product-view-cart">View your bag <ArrowUpRight size={14} /></Link>

          <div className="product-detail-note">
            <Heart size={15} /> Designed to be worn, kept and remembered.
          </div>
        </div>
      </section>

      <section className="product-detail-story">
        <div><p className="product-detail-kicker">THE DETAIL</p><h2>Quiet from a distance.<br /><em>Different up close.</em></h2></div>
        <p>{product.description || "Every surface is considered as part of the experience. The collection balances a restrained silhouette with details that reveal themselves when you get closer."}</p>
      </section>

      {related.length > 0 && (
        <section className="product-related">
          <div className="flex items-end justify-between mb-8"><div><p className="product-detail-kicker">MORE FROM THE COLLECTION</p><h2>Continue exploring.</h2></div><Link href={`/categories/${product.categories?.id}`} className="text-[10px] uppercase tracking-[.18em] flex items-center gap-2">View category <ArrowUpRight size={14} /></Link></div>
          <div className="product-related-grid">
            {related.map((item) => {
              const image = item.product_images?.find((img) => img.is_primary)?.image_url || item.product_images?.[0]?.image_url || fallbackImage;
              return <Link href={`/product/${item.id}`} key={item.id}><div><img src={image} alt={item.name || "Product"} /></div><span>{item.name}</span><strong>€{item.price}</strong></Link>;
            })}
          </div>
        </section>
      )}
    </main>
  );
}
