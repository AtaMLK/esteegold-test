import { create } from "zustand";
import { supabase } from "@/app/_lib/supabase";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetched: false,

  fetchProducts: async (force = false) => {
    if (get().loading || (get().fetched && !force)) return;

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          description,
          price,
          stock,
          material,
          categories (
            id,
            title,
            details,
            image_url
          ),
          product_images (
            id,
            image_url,
            is_primary
          )
        `)
        .order("id");

      if (error) throw error;
      set({ products: data || [], error: null, fetched: true });
    } catch (err) {
      console.error("Product fetch error:", err.message);
      set({ products: [], error: err.message, fetched: false });
    } finally {
      set({ loading: false });
    }
  },

  getProduct: (id) => get().products.find((product) => String(product.id) === String(id)),
}));
