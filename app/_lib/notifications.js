function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

export async function notifyAdminNewOrder(order) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.ORDER_NOTIFICATION_EMAIL;
  if (!apiKey || !from || !to) {
    console.warn("[order notification] RESEND_API_KEY, RESEND_FROM_EMAIL or ORDER_NOTIFICATION_EMAIL is missing.");
    return { sent: false, skipped: true };
  }

  const customer = order.customer_snapshot || {};
  const adminUrl = (process.env.NEXT_PUBLIC_SITE_URL || "") + "/admin/orders";
  const html = [
    '<div style="font-family:Arial,sans-serif;line-height:1.6">',
    "<h2>New order " + escapeHtml(order.order_number) + "</h2>",
    "<p><strong>Customer:</strong> " + escapeHtml(customer.fullName || "Guest") + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(customer.email || "—") + "</p>",
    "<p><strong>Total:</strong> " + escapeHtml(order.currency) + " " + escapeHtml(Number(order.total || 0).toFixed(2)) + "</p>",
    "<p><strong>Status:</strong> " + escapeHtml(order.status) + "</p>",
    '<p><a href="' + escapeHtml(adminUrl) + '">Open admin orders</a></p>',
    "</div>",
  ].join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "New EsteeHouse order " + order.order_number,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error("Resend notification failed: " + body.slice(0, 300));
  }
  return { sent: true };
}
