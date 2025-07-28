"use client";

import { motion } from "framer-motion";
import { ArrowLeft, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import EditProductComponent from "./EditProductComponent";
import { supabase } from "@/app/_lib/supabase";
import { useProductStore } from "@/app/_lib/ProductStore";

export default function ProductsList() {
  const { products, fetchProducts, deleteProduct } = useProductStore(); // ✅ use store
  const [editingProduct, setEditingProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) return;
    await deleteProduct(id); // ✅ call store method
  };

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-6">
      <button
        onClick={() => router.back()}
        className="absolute text-stone-600 p-5 top-0 left-5 rounded hover:bg-blue-900/20 bg-blue-900/10 shadow cursor-pointer"
      >
        <ArrowLeft className="hover:scale-125 transtion-all duration-200" />
      </button>

      {editingProduct && (
        <Modal
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
        >
          <EditProductComponent
            product={editingProduct}
            onDone={() => {
              setEditingProduct(null);
              fetchProducts(); // ✅ re-fetch on update
            }}
          />
        </Modal>
      )}

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {products.map((product) => {
          const primaryImage = product?.product_images?.find(
            (img) => img.is_primary
          );
          const imageUrl = primaryImage
            ? supabase.storage
                .from("product-images")
                .getPublicUrl(primaryImage?.image_url).data?.publicUrl
            : "/placeholder.jpg";

          return (
            <div
              key={product.id}
              className="relative top-20 w-[18rem] h-[25rem] bg-white border border-stone-200 hover:shadow-md rounded-xl overflow-hidden flex flex-col group"
            >
              <div className="justify-between border relative border-stone-200 hover:shadow-md rounded-xl flex flex-col pb-2 w-[18rem] h-[25rem]">
                <img
                  src={imageUrl}
                  className="w-full h-[12.5rem] z-10 object-center object-cover rounded-t-xl rounded-b-full"
                  alt={product.name}
                />
                <span className="w-full h-[14.5rem] bg-amber-200/30 rounded-full absolute top-0 group-hover:h-full group-hover:rounded-lg transition-all duration-150 z-0"></span>

                <div className="flex flex-col gap-2 px-4 py-2 z-10">
                  <h1 className="text-xl font-bold tracking-wider">
                    {product.name}
                  </h1>
                  <p className="flex items-center gap-2 text-md font-semibold">
                    {product.price}
                    <DollarSign size={16} />
                  </p>
                  <p className="text-sm line-clamp-2">{product.description}</p>
                </div>

                <div className="flex gap-10 px-5 py-2 z-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingProduct(product)}
                    className="bg-yellow-500 text-white px-2 py-1 text-sm rounded hover:shadow-sm shadow-amber-700/50"
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDelete(product.id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:shadow-sm shadow-amber-700/50 outline-0"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
