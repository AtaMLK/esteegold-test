const revenueStatuses = new Set(["paid", "processing", "shipped", "delivered"]);

export function isRecognizedRevenue(order) {
  return order.payment_status === "success" && revenueStatuses.has(order.status);
}

export function revenueByCurrency(orders) {
  return orders.reduce((totals, order) => {
    if (!isRecognizedRevenue(order)) return totals;
    const currency = order.currency || "EUR";
    const amount = Number(order.total);
    if (!Number.isFinite(amount)) return totals;
    totals[currency] = Math.round(((totals[currency] || 0) + amount) * 100) / 100;
    return totals;
  }, {});
}

export function formatMoney(amount, currency = "EUR") {
  return new Intl.NumberFormat("en", { style: "currency", currency }).format(Number(amount || 0));
}

export function formatRevenue(totals) {
  const currencies = Object.keys(totals).sort();
  return currencies.length ? currencies.map((currency) => formatMoney(totals[currency], currency)).join(" · ") : "No paid sales";
}
