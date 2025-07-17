"use client";

import ItemQuantity from "@/app/_components/ui/item-quantity";
import { useAuthStore } from "@/app/_lib/authStore";
import { useOrderStore } from "@/app/_lib/orderStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "../cart/cart.css";

function CartPage() {
  const { orders, fetchOrders, updateQuantity, deleteOrderItem } =
    useOrderStore();
  const { user } = useAuthStore();
  const [guestCart, setGuestCart] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      console.log(orders);
    } else {
      const stored = localStorage.getItem("guest_cart");
      setGuestCart(JSON.parse(stored || "[]"));
      console.log(orders);
    }
  }, [user?.id]);

  const items = user?.id ? orders : guestCart;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.unit_price * item.quantity,
    0
  );

  const handleQuantityChange = (newQuantity, item) => {
    if (user?.id) {
      updateQuantity(item.id, newQuantity);
    } else {
      const updated = guestCart.map((g) =>
        g.productId === item.productId ? { ...g, quantity: newQuantity } : g
      );
      setGuestCart(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
    }
  };

  const handleDelete = (item) => {
    if (user?.id) {
      deleteOrderItem(item.id);
    } else {
      const updated = guestCart.filter((g) => g.productId !== item.productId);
      setGuestCart(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-wrapper">
        <div className="cart-box flex flex-col gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="cart-items flex items-center justify-between w-full gap-6 border-b py-4"
            >
              <Image
                src={item.product?.image_url?.[0] || null}
                alt="Product"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-lg font-medium">{item.product?.name}</p>
                <p className="text-sm text-gray-600">{item.unit_price}$</p>
              </div>
              <ItemQuantity
                quantity={item.quantity}
                onChange={(val) => handleQuantityChange(val, item)}
              />
              <Trash2
                className="text-red-500 cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          ))}
        </div>

        <div className="cart-total max-w-md mt-6 flex items-center justify-between text-lg gap-4">
          <p>
            Total :{" "}
            <span className="text-lg font-bold mx-2">{totalQuantity}</span>
            Pcs
          </p>
          <p>{totalPrice.toFixed(2)} $</p>
        </div>

        <div className="cart-button mt-6">
          <Link href={user?.id ? "/checkout" : "/login"}>
            <Button className="w-full">Finish Your Purchase</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
