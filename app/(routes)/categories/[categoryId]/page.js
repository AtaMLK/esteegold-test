"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useProductStore } from "@/app/_lib/ProductStore";
import "../categories.css";

const fallbackImage = "/images/Hero-bg-2.jpg";

export default function CategoryDetailPage() {
  const { categoryId } = useParams();
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categoryProducts = useMemo(
    () => products.filter((product) => String(product.categories?.id) === String(categoryId)),
    [products, categoryId]
  );
  const category = categoryProducts[0]?.categories;

  if (loading && !products.length) return <div className="categories-state">Loading collection…</div>;
  if (error && !products.length) return <div className="categories-state">{error}</div>;
  if (!category) return <div className="categories-state">Category not found.</div>;

  return (
    <main className="categories-page">
      <section className="categories-intro">
        <Link href="/categories" className="flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-black/50"><ArrowLeft size={14} /> All categories</Link>
        <div>
          <p>{String(category.id).padStart(2, "0")} / COLLECTION</p>
          <h1>{category.title}</h1>
        </div>
        <span>{category.details || `Explore ${categoryProducts.length} pieces from the ${category.title} collection.`}</span>
      </section>

      <section className="categories-grid">
        {categoryProducts.map((product, index) => {
          const image = product.product_images?.find((item) => item.is_primary)?.image_url || product.product_images?.[0]?.image_url || fallbackImage;
          return (
            <Link href={`/product/${product.id}`} key={product.id} className="category-tile">
              <div className="category-tile-image">
                <img src={image} alt={product.name || "Product"} />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <ArrowUpRight />
              </div>
              <div className="category-tile-copy">
                <div><p>{product.material || "Hand finished"}</p><h2>{product.name}</h2></div>
                <p>€{product.price}</p>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
