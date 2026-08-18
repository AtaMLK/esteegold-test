"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useProductStore } from "@/app/_lib/ProductStore";
import "./categories.css";

const fallbackImage = "/images/Hero-bg-2.jpg";

export default function CategoriesPage() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const map = new Map();
    products.forEach((product) => {
      const category = product.categories;
      if (category?.id != null && !map.has(String(category.id))) {
        map.set(String(category.id), { ...category, productCount: 0, preview: null });
      }
      if (category?.id != null) {
        const current = map.get(String(category.id));
        current.productCount += 1;
        current.preview ||= product.product_images?.find((image) => image.is_primary)?.image_url || product.product_images?.[0]?.image_url;
      }
    });
    return [...map.values()];
  }, [products]);

  return (
    <main className="categories-page">
      <section className="categories-intro">
        <p>ESTEE GOLD STUDIO / CATEGORIES</p>
        <h1>Find the<br /><em>right language.</em></h1>
        <span>Every category opens a different part of the collection.</span>
      </section>

      {loading && !products.length ? (
        <div className="categories-state">Loading categories…</div>
      ) : error && !products.length ? (
        <div className="categories-state">{error}</div>
      ) : categories.length ? (
        <section className="categories-grid">
          {categories.map((category, index) => (
            <Link href={`/categories/${category.id}`} key={category.id} className="category-tile">
              <div className="category-tile-image">
                <Image src={category.preview || category.image_url || fallbackImage} alt={category.title || "Category"} fill sizes="(max-width: 800px) 90vw, 42vw" />
                <div className="category-tile-overlay" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight />
              </div>
              <div className="category-tile-copy">
                <div>
                  <p>{category.productCount} pieces</p>
                  <h2>{category.title}</h2>
                </div>
                <p>{category.details || "Explore the pieces in this collection."}</p>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <div className="categories-state">No categories are available yet.</div>
      )}
    </main>
  );
}
