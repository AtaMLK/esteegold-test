import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/payment", { method: "POST" });
      const data = await response.json();
      console.log("Payment result:", data);

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={` absolute flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-darkgreen-700"
        }`}
      >
        
        {loading ? "Payment in process..." : "Pay"}
      </button>
    </div>
  );
}
