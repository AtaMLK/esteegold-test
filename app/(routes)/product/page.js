"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/app/_lib/ProductStore";
import "./product.css";

const fallbackImage = "/images/Hero-bg-3.jpg";

export default function Product() {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const category = product.categories;
      if (category?.id != null) map.set(String(category.id), category);
    });
    return [...map.values()];
  }, [products]);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter((product) => String(product.categories?.id) === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <div className="catalog-hero-copy">
          <p>ESTEE GOLD STUDIO / COLLECTION 2026</p>
          <h1>Objects with<br /><em>a point of view.</em></h1>
          <div className="catalog-hero-bottom">
            <span>{products.length ? `${products.length} pieces` : "Curated pieces"}</span>
            <span className="flex items-center gap-2"><ArrowDownRight size={14} /> Scroll to explore</span>
          </div>
        </div>
        <div className="catalog-hero-image">
          <Image src={fallbackImage} alt="Estee Gold Studio collection" fill priority sizes="(max-width: 900px) 90vw, 48vw" className="object-cover" />
          <div className="catalog-orbit" />
        </div>
      </section>

      <section className="catalog-controls">
        <div>
          <p className="catalog-kicker">THE COLLECTION</p>
          <h2>Choose your direction.</h2>
        </div>
        <div className="catalog-filters">
          <SlidersHorizontal size={15} />
          <button className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>All</button>
          {categories.map((category) => (
            <button key={category.id} className={selectedCategory === String(category.id) ? "active" : ""} onClick={() => setSelectedCategory(String(category.id))}>
              {category.title}
            </button>
          ))}
        </div>
      </section>

      {loading && !products.length ? (
        <div className="catalog-state">Loading the collection…</div>
      ) : error && !products.length ? (
        <div className="catalog-state">{error}</div>
      ) : filtered.length ? (
        <section className="catalog-grid">
          {filtered.map((product, index) => {
            const image = product.product_images?.find((item) => item.is_primary)?.image_url || product.product_images?.[0]?.image_url || fallbackImage;
            return (
              <Link href={`/product/${product.id}`} key={product.id} className={`catalog-card ${index % 5 === 0 ? "catalog-card-featured" : ""}`}>
                <div className="catalog-card-image">
                  <img src={image} alt={product.name || "Product"} />
                  <span className="catalog-card-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="catalog-card-arrow"><ArrowUpRight size={17} /></span>
                </div>
                <div className="catalog-card-meta">
                  <div>
                    <p>{product.categories?.title || "Object"}</p>
                    <h3>{product.name}</h3>
                  </div>
                  <strong>€{product.price}</strong>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <div className="catalog-state">No products match this category.</div>
      )}

      <section className="catalog-category-strip">
        <p className="catalog-kicker">BY CATEGORY</p>
        <div className="catalog-category-links">
          {categories.map((category) => (
            <Link href={`/categories/${category.id}`} key={category.id}>
              <span>{category.title}</span><ArrowUpRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
