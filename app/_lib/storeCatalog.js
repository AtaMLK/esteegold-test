// Temporary trusted server catalog until the existing product database is migrated into the commerce model.
// Never import this module into a client component.

export const STORE_CATALOG = {
  "1": { id: "1", name: "Essential Ring", category: "Rings", productLine: "EsteeGold", price: 69, discountPercent: 0 },
  "2": { id: "2", name: "Layered Set", category: "Sets", productLine: "EsteeGold", price: 118, discountPercent: 0 },
  "3": { id: "3", name: "Statement Earrings", category: "Earrings", productLine: "EsteeGold", price: 48, discountPercent: 0 },
  "4": { id: "4", name: "Hand Combination", category: "Bracelets", productLine: "EsteeGold", price: 92, discountPercent: 0 },
  "5": { id: "5", name: "Classic Earrings", category: "Earrings", productLine: "EsteeGold", price: 39.99, discountPercent: 0 },
  "6": { id: "6", name: "Everyday Bracelet", category: "Bracelets", productLine: "EsteeGold", price: 59, discountPercent: 0 },
};

export function resolveCatalogItem(id) {
  return STORE_CATALOG[String(id)] || null;
}

export function calculateLine(item, quantity) {
  const listPrice = Number(item.price);
  const discount = Math.min(100, Math.max(0, Number(item.discountPercent || 0)));
  const unitDiscount = Number((listPrice * discount / 100).toFixed(2));
  const unitFinalPrice = Number((listPrice - unitDiscount).toFixed(2));
  const lineTotal = Number((unitFinalPrice * quantity).toFixed(2));
  return { listPrice, unitDiscount, unitFinalPrice, lineTotal };
}
