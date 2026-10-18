export const MATERIAL_OPTIONS = ["925 Silver", "14K Gold Plated"];

export function productKind(product) {
  return product.product_kind || (product.branch === "EsteeBags" ? "bag" : product.branch === "EsteeGold" ? "silver" : "other");
}

export function defaultSizeType(category = "") {
  if (/earring/i.test(category)) return "one_size";
  if (/ring/i.test(category)) return "ring";
  if (/bracelet/i.test(category)) return "bracelet";
  if (/necklace|pendant/i.test(category)) return "necklace";
  return "none";
}

export const SIZE_OPTIONS = {
  none: [],
  one_size: ["One size"],
  ring: ["48", "50", "52", "54", "56", "58", "60", "62"],
  bracelet: ["16 cm", "17 cm", "18 cm", "19 cm", "20 cm", "21 cm", "22 cm"],
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
  if (productKind(product) !== "silver") {
    return { material_options: [], size_type: "none", size_options: [], stone_options: [], stone_required: false, gold_available: false, gold_price_eur: null, gold_price_try: null };
  }
  const sizeType = Object.hasOwn(SIZE_OPTIONS, product.size_type) ? product.size_type : "none";
  const stones = Array.isArray(product.stone_options) ? product.stone_options : [];
  const names = new Set();
  const stoneOptions = stones.map((item) => typeof item === "string" ? { name: item.trim() } : { name: String(item?.name || "").trim(), note: String(item?.note || "").trim() })
    .filter((item) => item.name && !names.has(item.name) && names.add(item.name)).slice(0, 30);
  return {
    material_options: textOptions(product.material_options).map((name) => /925/.test(name) ? MATERIAL_OPTIONS[0] : name).filter((name) => MATERIAL_OPTIONS.includes(name)),
    size_type: sizeType,
    size_options: sizeType === "none" ? [] : textOptions(product.size_options),
    stone_options: stoneOptions,
    stone_required: product.stone_required === true,
    gold_available: product.gold_available === true,
    gold_price_eur: product.gold_available === true ? product.gold_price_eur ?? null : null,
    gold_price_try: product.gold_available === true ? product.gold_price_try ?? null : null,
  };
}
