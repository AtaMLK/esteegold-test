"use client";

import { useAppearance } from "../../context/appearanceContext";

import { MATERIAL_OPTIONS, productKind } from "../../_lib/commerce/product-options";
import Link from "./localized-link";

export default function CustomerProductOptions({ product, options, setOptions }) {
  const { translateText } = useAppearance();
  const silver = productKind(product) === "silver";
  const sizes = product.size_options || [];
  const sizeLabel = product.size_type === "ring" ? translateText("Ring size / EU circumference in mm") : product.size_type === "bracelet" ? translateText("Bracelet length / cm") : product.size_type === "necklace" ? translateText("Necklace length / cm") : translateText("Size");
  const materials = silver ? MATERIAL_OPTIONS : product.material_options || [];
  const available = product.material_options || [];
  const platedPrice = Number(product.regional_price?.region === "TR" ? product.gold_price_try : product.gold_price_eur);
  return <div className="mt-8 space-y-5 border-y border-black/10 py-6">
    {(silver || materials.length > 0) && <label className="block text-[9px] uppercase tracking-[.18em] text-black/60">{translateText("Material")}<select aria-label={translateText("Material")} required value={options.material} onChange={(event) => setOptions((previous) => ({ ...previous, material: event.target.value }))} className="mt-2 w-full border-b border-black/20 bg-transparent py-3 text-sm normal-case tracking-normal"><option value="">{translateText("Choose material")}</option>{materials.map((name) => { const unavailable = !available.includes(name) || (name === MATERIAL_OPTIONS[1] && (!product.gold_available || platedPrice <= 0)); return <option key={name} disabled={unavailable} value={name}>{translateText(name)}{unavailable ? translateText(" — not configured for this piece") : ""}</option>; })}</select></label>}
    {(silver || sizes.length > 0) && <label className="block text-[9px] uppercase tracking-[.18em] text-black/60">{sizeLabel}<select aria-label={translateText("Size")} required disabled={!sizes.length} value={options.size} onChange={(event) => setOptions((previous) => ({ ...previous, size: event.target.value }))} className="mt-2 w-full border-b border-black/20 bg-transparent py-3 text-sm normal-case tracking-normal disabled:opacity-60"><option value="">{sizes.length ? translateText("Choose size") : translateText("Contact the house to confirm sizing")}</option>{sizes.map((size) => <option key={size} value={size}>{product.size_type === "ring" ? `EU ${size} / ${size} mm` : translateText(size)}</option>)}</select></label>}
    {product.stone_options?.length > 0 && <label className="block text-[9px] uppercase tracking-[.18em] text-black/60">{translateText("Stone")}{product.stone_required ? translateText(" · required") : ""}<select aria-label={translateText("Stone")} value={options.stone} onChange={(event) => setOptions((previous) => ({ ...previous, stone: event.target.value }))} className="mt-2 w-full border-b border-black/20 bg-transparent py-3 text-sm normal-case tracking-normal"><option value="">{translateText("Choose a stone")}</option>{product.stone_options.map((stone) => { const name = typeof stone === "string" ? stone : stone.name; return <option key={name} value={name}>{translateText(name)}</option>; })}</select></label>}
    {silver && <p className="text-xs leading-6 text-black/55">{translateText("Gold plated means a gold surface finish, not solid 14K gold. Ring sizes use the EU circumference system; bracelet and necklace options describe the finished length. Please check your measurements before ordering.")}</p>}
    {silver && <Link href="/size-guide" className="inline-block text-xs underline underline-offset-4">{translateText("Size & material guide ↗")}</Link>}
    {product.customization_note && <p className="text-xs leading-6 text-black/55">{product.customization_note}</p>}
  </div>;
}
