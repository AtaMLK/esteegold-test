"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/app/_lib/ProductStore";
import { supabase } from "@/app/_lib/supabaseClient";
import { productSchema } from "@/app/validation/ProductSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToastStore } from "@/hooks/useToastStore";

export default function EditProductComponent({ product, onDone }) {
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const primaryImage = product?.product_images?.find((img) => img.is_primary);
  const [imagePath, setImagePath] = useState(primaryImage?.image_url || "");
  const { showToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      description: product?.description || "",
      material: product?.material || "",
      stock: product?.stock || 1,
      category_id: product?.category_id || "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title");
      if (!error) setCategories(data);
    };
    fetchCategories();
  }, []);

  const selectedCategoryId = watch("category_id");
  const selectedCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  const onSubmit = async (data) => {
    try {
      let finalImagePath = imagePath;

      if (data.image && data.image[0]) {
        const file = data.image[0];
        const fileName = `${Date.now()}-${file.name}`;
        const categoryFolder =
          selectedCategory?.title?.toLowerCase() || "uncategorized";
        const fullPath = `${categoryFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fullPath, file, { upsert: true });

        if (uploadError) throw uploadError;

        finalImagePath = fullPath;
        setImagePath(fullPath);
        showToast("Product details edited successfully", "success");
      }

      const { error } = await supabase
        .from("products")
        .update({
          name: data.name,
          price: data.price,
          description: data.description,
          material: data.material,
          stock: data.stock,
          category_id: data.category_id,
        })
        .eq("id", product.id);

      if (!error && finalImagePath !== imagePath) {
        await supabase
          .from("product_images")
          .update({ image_url: finalImagePath })
          .eq("product_id", product.id)
          .eq("is_primary", true);
      }

      useProductStore.getState().fetchProducts();
      onDone();
    } catch (err) {
      showToast("Error updating Product", "error");
    }
  };

  return (
    <div className="relative shadow w-full rounded">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-stone-200/30 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-150 px-5 grid grid-cols-3 gap-8 py-20"
      >
        {/* Image Upload */}
        <div className="flex flex-col gap-4 col-span-1 items-center justify-between pt-8">
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
          {(preview || imagePath) && (
            <img
              src={
                preview
                  ? preview
                  : supabase.storage
                      .from("product-images")
                      .getPublicUrl(imagePath).data.publicUrl
              }
              alt="Preview"
              className="w-64 h-64 object-cover rounded-full"
            />
          )}
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded mt-5"
          >
            Save changes
          </button>
        </div>

        {/* Inputs */}
        <div className="col-start-2 col-span-2 grid gap-4">
          {/* Name */}
          <div>
            <label className="font-semibold text-lg">Title</label>
            <input
              {...register("name")}
              className="rounded px-4 py-2 border w-full"
              placeholder="Product title"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-lg">Price</label>
            <input
              type="number"
              {...register("price")}
              className="rounded px-4 py-2 border w-full"
              placeholder="Price"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Material */}
          <div>
            <label className="font-semibold text-lg">Material</label>
            <select
              {...register("material")}
              className="rounded px-4 py-2 border w-full"
            >
              <option value="">Select Material</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
            {errors.material && (
              <p className="text-red-500">{errors.material.message}</p>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="font-semibold text-lg">Stock</label>
            <select
              {...register("stock")}
              className="rounded px-4 py-2 border w-full"
            >
              <option value="">Select Stock</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.stock && (
              <p className="text-red-500">{errors.stock.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="font-semibold text-lg">Category</label>
            <select
              {...register("category_id")}
              className="rounded px-4 py-2 border w-full"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500">{errors.category_id.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-lg">Description</label>
            <textarea
              {...register("description")}
              className="rounded px-4 py-2 border w-full h-32"
              placeholder="Product description"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
