"use client";

import Image from "next/image";
import { Maximize2, Play } from "lucide-react";
import { useMemo, useState } from "react";

function mediaSource(product) {
  const rows = Array.isArray(product.media) ? product.media : [];
  if (rows.length) return rows;
  if (product.image_url) {
    return [{ id: "fallback", kind: "image", url: product.image_url, alt_text: product.name, is_primary: true, sort_order: 0 }];
  }
  return [{ id: "fallback", kind: "image", url: "/images/Hero-bg-1.jpg", alt_text: product.name, is_primary: true, sort_order: 0 }];
}

export default function ProductGallery({ product }) {
  const media = useMemo(() => mediaSource(product), [product]);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState({ x: 50, y: 50, active: false });
  const current = media[active] || media[0];

  function updateZoom(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
      active: true,
    });
  }

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_7rem]">
      <div
        className="relative min-h-[58vh] overflow-hidden bg-[#d7d0c3] md:min-h-[72vh]"
        onMouseMove={current?.kind === "image" ? updateZoom : undefined}
        onMouseLeave={() => setZoom((value) => ({ ...value, active: false }))}
        onClick={() => setZoom((value) => ({ ...value, active: !value.active }))}
        role={current?.kind === "image" ? "img" : undefined}
        aria-label={current?.kind === "image" ? current.alt_text || product.name : undefined}
      >
        {current?.kind === "video" ? (
          <video src={current.url} className="absolute inset-0 h-full w-full object-cover" controls playsInline preload="metadata" />
        ) : (
          <>
            <Image
              src={current.url}
              alt={current.alt_text || product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized={current.url?.startsWith("http")}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-200 ${zoom.active ? "opacity-100" : "opacity-0"}`}
              style={{
                backgroundImage: `url("${current.url}")`,
                backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                backgroundSize: "220%",
              }}
            />
            <div className="pointer-events-none absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-[8px] uppercase tracking-[.2em] backdrop-blur-sm">
              <Maximize2 size={12} /> {zoom.active ? "Move to inspect" : "Move to magnify"}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 lg:grid-cols-1 lg:auto-rows-[7rem]">
        {media.map((item, index) => (
          <button
            key={item.id || `${item.url}-${index}`}
            type="button"
            onClick={() => {
              setActive(index);
              setZoom({ x: 50, y: 50, active: false });
            }}
            className={`group relative overflow-hidden bg-black/[.04] text-left ${index === active ? "ring-1 ring-black" : "opacity-65 hover:opacity-100"}`}
            aria-label={`View ${item.kind} ${index + 1}`}
          >
            {item.kind === "video" ? (
              <div className="absolute inset-0 grid place-items-center bg-black text-white">
                <Play size={18} fill="currentColor" />
              </div>
            ) : (
              <Image src={item.url} alt="" fill className="object-cover" sizes="112px" unoptimized={item.url?.startsWith("http")} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
