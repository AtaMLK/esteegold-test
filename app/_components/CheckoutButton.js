import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    const response = await fetch("/api/payment", { method: "POST" });
    const data = await response.json();
    console.log("Ödeme Sonucu:", data);
    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      {loading ? "Ödeme Yapılıyor..." : "Ödeme Yap"}
    </button>
  );
}
