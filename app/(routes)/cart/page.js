"use client";

import { useState, useEffect } from "react";
import ItemQuantity from "@/app/_components/ui/item-quantity";
import { useAuthStore } from "@/app/_lib/authStore";
import { useOrderStore } from "@/app/_lib/orderStore";
import { useToastStore } from "@/hooks/useToastStore";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "../cart/cart.css";

function CartPage() {
  const { user } = useAuthStore();
  const {
    orders,
    fetchOrders,
    updateQuantity,
    deleteOrderItem,
    transferGuestCart,
  } = useOrderStore();

  const { showToast } = useToastStore();
  const [guestCart, setGuestCart] = useState([]);
  const [guestCartDetails, setGuestCartDetails] = useState([]);

  // Fetch guestCart from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("guest_cart");
    if (stored) setGuestCart(JSON.parse(stored));
  }, []);

  // After login, transfer guestCart to user orders
  useEffect(() => {
    if (user?.id && guestCart.length > 0) {
      (async () => {
        await transferGuestCart(user.id);
        setGuestCart([]);
      })();
    }
  }, [user?.id, guestCart, transferGuestCart]);

  // Fetch guest cart details for rendering
  useEffect(() => {
    const fetchGuestCartDetails = async () => {
      if (!guestCart.length) {
        setGuestCartDetails([]);
        return;
      }

      const productIds = guestCart.map((item) => item.productId);
      const { data, error } = await fetch("/api/fetch-guest-products", {
        method: "POST",
        body: JSON.stringify({ productIds }),
      })
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          return [];
        });

      if (data) {
        const detailed = guestCart.map((item) => {
          const product = data.find((p) => p.id === item.productId);
          return product ? { ...product, quantity: item.quantity } : item;
        });
        setGuestCartDetails(detailed);
      }
    };

    if (!user?.id) fetchGuestCartDetails();
  }, [guestCart, user?.id]);

  // Determine items to render
  const items = user?.id ? orders : guestCartDetails;

  // Calculate totals
  const totalQuantity = items.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );
  const totalPrice = items.reduce(
    (acc, item) =>
      acc + (item.unit_price || item.price || 0) * (item.quantity || 0),
    0
  );

  // Handle quantity change
  const handleQuantityChange = async (newQuantity, item) => {
    if (user?.id) {
      await updateQuantity(newQuantity, item.id);
      await fetchOrders();
    } else {
      const updated = guestCart.map((g) =>
        g.productId === item.id ? { ...g, quantity: newQuantity } : g
      );
      setGuestCart(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      // Update guestCartDetails immediately
      setGuestCartDetails((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, quantity: newQuantity } : p
        )
      );
    }
  };

  // Handle delete
  const handleDelete = async (item) => {
    if (user?.id) {
      await deleteOrderItem(item.id);
      await fetchOrders();
    } else {
      const updated = guestCart.filter((g) => g.productId !== item.id);
      setGuestCart(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
      setGuestCartDetails((prev) => prev.filter((p) => p.id !== item.id));
      showToast("Item deleted from cart", "info");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-wrapper">
        <div className="cart-box">
          {items.map((item, index) => (
            <div key={item.id || index} className="cart-items">
              <Image
                width={80}
                height={80}
                src={item?.product_images?.[0]?.image_url || "/placeholder.jpg"}
                alt={item.name}
                className="cart-item-image"
              />
              <h2 className="font-semibold text-md">{item.name}</h2>
              <p>{(item.unit_price || item.price || 0).toFixed(2)}$</p>
              <ItemQuantity
                initial={item.quantity}
                onChange={(val) => handleQuantityChange(val, item)}
              />
              <Trash2 onClick={() => handleDelete(item)} />
            </div>
          ))}
        </div>

        <div className="cart-total">
          <div className="flex justify-between">
            <p>
              Total: <span>{totalQuantity}</span> pcs
            </p>
            <p>{totalPrice.toFixed(2)} $</p>
          </div>
          <div className="cart-button">
            <Link href={user?.id ? "/checkout" : "/login"}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-4 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all"
              >
                Finish Your Purchase
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
