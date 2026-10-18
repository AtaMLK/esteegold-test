export function collectionLabel(branch) {
  if (branch === "EsteeGold" || branch === "gold" || branch === "silver") return "EsteeGold";
  if (branch === "EsteeBags" || branch === "bags") return "EsteeBags";
  return branch || "The house";
}

export function normalizeCollection(branch) {
  if (["gold", "silver", "EsteeGold"].includes(branch)) return "silver";
  if (["bags", "EsteeBags"].includes(branch)) return "bags";
  return branch && branch !== "all" ? branch : "all";
}
