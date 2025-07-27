"use client";

import { supabase } from "@/app/_lib/supabase";
import { useToastStore } from "@/hooks/useToastStore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Component to add a new product
export default function AddProductComponent({ onDone }) {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToastStore();
  const [imageFiles, setImageFiles] = useState([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState(0); // default first image

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchImage = watch("image");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, title");
      if (error) {
        console.error("Failed to fetch categories:", error);
      } else {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setUploading(true);

      // 1. Insert product (without image first)
      const { data: inserted, error: insertError } = await supabase
        .from("products")
        .insert([
          {
            name: data.name,
            price: parseFloat(data.price),
            material: data.material,
            stock: parseInt(data.stock),
            description: data.description,
            category_id: data.category_id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Upload image to bucket (use category as folder)
      const imageFiles = Array.from(data.image);
      const categoryFolder =
        categories
          .find((c) => c.id === data.category_id)
          ?.title.toLowerCase() || "uncategorized";

      console.log("imageFiles =>", imageFiles);

      // 3. Upload all images and save their URLs
      const imageInsertions = await Promise.all(
        imageFiles.map(async (imageFile, index) => {
          const imagePath = `${categoryFolder}/${inserted.name}/${Date.now()}_${
            imageFile.name
          }`;

          const { error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(imagePath, imageFile);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(imagePath);

          return {
            product_id: inserted.id,
            image_url: urlData.publicUrl,
            is_primary: index === primaryImageIndex, // only first image is marked primary
          };
        })
      );
      // 4. Save all image records
      const { error: imageInsertError } = await supabase
        .from("product_images")
        .insert(imageInsertions);

      if (imageInsertError) throw imageInsertError;

      showToast("Product added.", "success");
      reset();
      onDone?.();
    } catch (err) {
      console.error("Insert failed:", err.message);
      showToast("Error adding item.", "error");
    } finally {
      setUploading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Category Selection */}
      <label>Category</label>
      <select
        {...register("category_id", { required: true })}
        className="border p-2"
      >
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>
      {errors.category_id && (
        <span className="text-red-500">Category is required</span>
      )}

      {/* Material Selection */}
      <label>Material</label>
      <select
        {...register("material", { required: true })}
        className="border p-2"
      >
        <option value="">Select material</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
      </select>
      {errors.material && (
        <span className="text-red-500">Material is required</span>
      )}

      {/* Stock Selection */}
      <label>Stock</label>
      <select {...register("stock", { required: true })} className="border p-2">
        <option value="">Select stock</option>
        {Array.from({ length: 10 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      {errors.stock && <span className="text-red-500">Stock is required</span>}

      {/* Name Input */}
      <label>Name</label>
      <input
        {...register("name", { required: true })}
        placeholder="Product name"
        className="border p-2"
      />
      {errors.name && <span className="text-red-500">Name is required</span>}

      {/* Price Input */}
      <label>Price</label>
      <input
        {...register("price", { required: true })}
        placeholder="Price"
        type="number"
        step="0.01"
        className="border p-2"
      />
      {errors.price && <span className="text-red-500">Price is required</span>}

      {/* Description */}
      <label>Description</label>
      <textarea
        {...register("description")}
        placeholder="Description"
        className="border p-2"
      />

      {/* Image Upload */}
      <label>Product Image</label>
      <input
        type="file"
        accept="image/*"
        multiple
        {...register("image", { required: true })}
        className="border p-2"
      />
      {errors.image && <span className="text-red-500">Image is required</span>}

      {/* Image Preview with Primary Selection */}
      {watchImage?.length > 0 && (
        <div className="flex gap-4 flex-wrap mt-4">
          {Array.from(watchImage).map((file, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center border p-2 rounded shadow"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${idx}`}
                className={`w-24 h-24 object-cover rounded ${
                  idx === primaryImageIndex ? "ring-2 ring-blue-500" : ""
                }`}
              />
              <label className="mt-2 text-sm">
                <input
                  type="radio"
                  name="primaryImage"
                  checked={primaryImageIndex === idx}
                  onChange={() => setPrimaryImageIndex(idx)}
                />{" "}
                Primary
              </label>
            </div>
          ))}
        </div>
      )}
      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploading}
        className="bg-black text-white py-2 px-4 mt-4"
      >
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}
