export const MATERIAL_OPTIONS = ["925 Sterling Silver", "14K Gold", "18K Gold"];

export const SIZE_OPTIONS = {
  none: [],
  ring: ["50", "52", "54", "56", "58", "60"],
  bracelet: ["XS", "S", "M", "L", "XL", "XS/S · 16 cm", "S/M · 18 cm", "M/L · 20 cm"],
  necklace: ["40 cm", "45 cm", "50 cm", "55 cm", "60 cm", "75 cm"],
};

export const STONE_OPTIONS = [
  "None", "Natural stone", "Cubic zirconia", "Onyx", "Amethyst", "Rose Quartz",
  "Clear Quartz", "Citrine", "Garnet", "Moonstone", "Turquoise", "Lapis Lazuli", "Peridot",
];

function textOptions(value) {
  return Array.isArray(value) ? [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))].slice(0, 30) : [];
}

export function normalizeProductOptions(product) {
  if (product.branch === "EsteeBags") {
    return { material_options: [], size_type: "none", size_options: [], stone_options: [], stone_required: false, gold_available: false, gold_price_eur: null, gold_price_try: null };
  }
  const sizeType = Object.hasOwn(SIZE_OPTIONS, product.size_type) ? product.size_type : "none";
  const stones = Array.isArray(product.stone_options) ? product.stone_options : [];
  const names = new Set();
  const stoneOptions = stones.map((item) => typeof item === "string" ? { name: item.trim() } : { name: String(item?.name || "").trim(), note: String(item?.note || "").trim() })
    .filter((item) => item.name && !names.has(item.name) && names.add(item.name)).slice(0, 30);
  return {
    material_options: textOptions(product.material_options),
    size_type: sizeType,
    size_options: sizeType === "none" ? [] : textOptions(product.size_options),
    stone_options: stoneOptions,
    stone_required: product.stone_required === true,
    gold_available: product.gold_available === true,
    gold_price_eur: product.gold_available === true ? product.gold_price_eur ?? null : null,
    gold_price_try: product.gold_available === true ? product.gold_price_try ?? null : null,
  };
}
