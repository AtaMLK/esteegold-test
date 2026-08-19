import { getProductMap, priceForProduct } from "./commerce/catalog";

export async function resolveCatalogItems(ids) {
  const normalizedIds = [...new Set(ids.map((id) => String(id)))];
  return getProductMap(normalizedIds);
}

export async function calculateLine(product, quantity) {
  const safeQuantity = Math.max(1, Math.min(99, Math.floor(Number(quantity || 1))));
  const pricing = priceForProduct(product);
  return {
    quantity: safeQuantity,
    listPrice: pricing.listPrice,
    unitDiscount: pricing.unitDiscount,
    unitFinalPrice: pricing.finalPrice,
    lineTotal: Number((pricing.finalPrice * safeQuantity).toFixed(2)),
  };
}
