"use client";

import ItemQuantity from "@/app/_components/ui/item-quantity";
import { useAuthStore } from "@/app/_lib/authStore";
import { useOrderStore } from "@/app/_lib/orderStore";
import { supabase } from "@/app/_lib/supabase";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "../cart/cart.css";
import Image from "next/image";

function CartPage() {
  const { orders, fetchOrders, updateQuantity, deleteOrderItem } =
    useOrderStore();
  const { user } = useAuthStore();
  const [guestCart, setGuestCart] = useState([]);
  const [guestCartDetails, setGuestCartDetails] = useState([]);

  useEffect(() => {
    const fetchGuestCartDetails = async () => {
      if (guestCart.length === 0) {
        setGuestCartDetails([]);
        return;
      }

      const productIds = guestCart.map((item) => item.productId);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price,material,stock,product_images(image_url)")
        .in("id", productIds);

      if (error) {
        console.error("Error fetching guest cart details:", error);
      } else {
        // products quantity
        const detailed = guestCart.map((item) => {
          const product = data.find((p) => p.id === item.productId);
          return product ? { ...product, quantity: item.quantity } : item;
        });

        setGuestCartDetails(detailed);
      }
    };

    fetchGuestCartDetails();
  }, [guestCart]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      const stored = localStorage.getItem("guest_cart");
      setGuestCart(JSON.parse(stored || "[]"));
    }
  }, [user?.id, fetchOrders]);

  const items = user?.id ? orders : guestCartDetails;
  const totalQuantity = items.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );
  const totalPrice = items.reduce(
    (acc, item) =>
      acc + (item.unit_price || item.price || 0) * (item.quantity || 0),
    0
  );

  const handleQuantityChange = async (newQuantity, item) => {
    if (user?.id) {
      await updateQuantity(newQuantity, item.id);
      await fetchOrders();
    } else {
      const updated = guestCart.map((g) =>
        g.productId === item.productId ? { ...g, quantity: newQuantity } : g
      );
      setGuestCart(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
    }
  };

  const handleDelete = async (item) => {
    if (user?.id) {
      await deleteOrderItem(item.id);
      await fetchOrders();
    } else {
      const updated = guestCart.filter((g) => g.productId !== item.id);
      setGuestCart(updated);
      localStorage.setItem("guest_cart", JSON.stringify(updated));
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-wrapper">
        <div className=" cart-box ">
          {user
            ? orders.map((item, index) => (
                <div
                  key={index}
                  className=" cart-items relative overflow-hidden"
                >
                  <Image
                    /* width={80}
                      height={80} */
                    fill
                    src={item.product?.image || "/placeholder.jpg"}
                    alt={item.product?.name || "product"}
                    className="cart-item-image w-48 h-48 lg:w-80 lg:h-80  overflow-hidden object-cover"
                  />
                  <h2 className="cart-item-name">{item.product?.name}</h2>
                  <p className="cart-item-price">{item.unit_price} $</p>
                  <ItemQuantity
                    initial={item.quantity}
                    onChange={(val) => handleQuantityChange(val, item)}
                  />
                  <Trash2
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ))
            : guestCartDetails.map((item, index) => (
                <div key={index} className="cart-items  ">
                  <Image
                    width={80}
                    height={80}
                    src={
                      item?.product_images?.[0]?.image_url || "/placeholder.jpg"
                    }
                    alt={item.name}
                    className="cart-item-image object-center col-span-2 col-start-1"
                  />
                  <h2 className="font-semibold text-md col-span-4 col-start-3 ">
                    {item.name}
                  </h2>
                  <p className="col-span-2 col-start-7">{item.price}$</p>
                  <ItemQuantity
                    className="col-span-3 col-start-8"
                    initial={item.quantity}
                    onChange={(val) => handleQuantityChange(val, item)}
                  />
                  <Trash2
                    className="cart-items-delete"
                    onClick={() => handleDelete(item)}
                  />
                </div>
              ))}
        </div>

        <div className="cart-total w-full px-[12%] mt-6 flex items-center justify-between text-lg gap-4 flex-col">
          <div className="flex w-full justify-between">
            <p>
              Total :{" "}
              <span className="text-lg font-bold mx-2">{totalQuantity}</span>
              Pcs
            </p>
            <p>{totalPrice.toFixed(2)} $</p>
          </div>
          <div className="cart-button my-6 w-full">
            <Link href={user?.id ? "/checkout" : "/login"}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full py-2 px-4 bg-green-700/70 text-white font-normal text-md rounded-lg hover:bg-green-800/80 transition-all duration-100"
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
