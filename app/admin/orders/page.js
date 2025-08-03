"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "@/app/_lib/orderStore";
import { supabase } from "@/app/_lib/supabaseClient";

export default function AdminOrdersPage() {
  const { orders, fetchOrders, loading } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColor = {
    delivered: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  useEffect(() => {
    fetchOrders();
    console.log(orders)
  }, []);

  const groupedOrders = orders.reduce((acc, item) => {
    const orderId = item.order.id;
    if (!acc[orderId]) {
      acc[orderId] = {
        ...item.order,
        items: [],
        total_price: 0,
      };
    }
    acc[orderId].items.push({
      product: item.products,
      quantity: item.quantity,
      unit_price: item.unit_price,
    });
    acc[orderId].total_price += item.unit_price * item.quantity;
    return acc;
  }, {});

  const ordersArray = Object.values(groupedOrders);

  const filteredGroupedOrders = ordersArray.filter((order) => {
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    const matchSearch = searchTerm
      ? order.items.some((item) =>
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    fetchOrders();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filter Controls */}
      <div className="flex gap-4">
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
        <input
          type="text"
          placeholder="Search product name..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded shadow-sm w-64"
        />
      </div>

      {/* Orders List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {filteredGroupedOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg shadow-sm p-4 bg-white hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index}>{item.product.name}</div>
                  ))}
                </div>
                <div className="font-semibold text-right">
                  {order.total_price.toFixed(2)} €
                </div>
              </div>

              <div
                className={`${
                  statusColor[order.status]
                } px-4 py-1 rounded text-sm inline-block font-medium`}
              >
                {order.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white p-8 rounded-lg max-w-lg w-full relative space-y-4 shadow-lg"
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Order Detail</h2>

            <div className="space-y-3">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <img
                    src={item.product?.image_url}
                    alt={item.product.name}
                    className="w-14 h-14 object-cover rounded"
                    fill
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × {item.unit_price.toFixed(2)} €
                    </p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">
                    {(item.unit_price * item.quantity).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            <div className="text-right text-lg font-bold">
              Total: {selectedOrder.total_price.toFixed(2)} €
            </div>

            <select
              defaultValue={selectedOrder.status}
              onChange={(e) =>
                handleStatusChange(selectedOrder.id, e.target.value)
              }
              className="mt-4 px-3 py-2 border rounded w-full shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </motion.div>
        </div>
      )}
    </div>
  );
}
