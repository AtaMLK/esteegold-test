"use client";

import { useProductStore } from "@/app/_lib/ProductStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight, EuroIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

function MiniSlider() {
  const { products, loading, error, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading && !products.length) {
    return <div className="flex min-h-48 items-center justify-center text-xs uppercase tracking-[.2em] text-black/40">Loading collection</div>;
  }

  if (error && !products.length) {
    return <div className="min-h-48 flex items-center justify-center text-sm text-black/50">The collection is temporarily unavailable.</div>;
  }

  const items = products
    .map((product) => ({
      product,
      image: product.product_images?.find((image) => image.is_primary)?.image_url || product.product_images?.[0]?.image_url,
    }))
    .filter((item) => item.image);

  if (!items.length) {
    return <div className="min-h-48 flex items-center justify-center text-sm text-black/50">No pieces are available yet.</div>;
  }

  return (
    <div className="relative px-1 py-6 md:px-6">
      <Carousel opts={{ align: "start", loop: items.length > 4 }}>
        <CarouselContent className="-ml-4">
          {items.map(({ product, image }) => (
            <CarouselItem key={product.id} className="basis-[72%] pl-4 sm:basis-1/2 lg:basis-1/4">
              <Link href={`/product/${product.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#ece8df]">
                  <img src={image} alt={product.name || "Product"} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 text-white">
                    <div>
                      <p className="text-[9px] uppercase tracking-[.22em] text-white/65">{product.categories?.title || "Collection"}</p>
                      <h3 className="mt-1 font-serif text-2xl leading-none">{product.name}</h3>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[.14em]">
                  <span>{product.material || "Hand finished"}</span>
                  <span className="flex items-center gap-1"><EuroIcon size={11} />{product.price}</span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 hidden md:flex" />
        <CarouselNext className="-right-3 hidden md:flex" />
      </Carousel>
    </div>
  );
}

export default MiniSlider;
