export function collectionLabel(branch) {
  if (branch === "EsteeGold" || branch === "gold" || branch === "silver") return "Silver";
  if (branch === "EsteeBags" || branch === "bags") return "Bags";
  return branch || "The house";
}

export function normalizeCollection(branch) {
  if (["gold", "silver", "EsteeGold"].includes(branch)) return "silver";
  if (["bags", "EsteeBags"].includes(branch)) return "bags";
  return "all";
}
