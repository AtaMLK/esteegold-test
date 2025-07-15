import { create } from "zustand";
import { supabase } from "@/app/_lib/supabase";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    /* const state = get(); // get access to current state
    if (state.loading) return; // don't fetch again while loading */
    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.from("products").select(`id,
            name,
            price,
            stock,
            material,
            Description,
            categories:category_id (
              id,
              title,
              image_url,
              details
            ),
            product_images (
              id,
              image_url,
              is_primary
            )
        `);

      if (error) throw error;

      set({ products: data || [] });
    } catch (err) {
      console.error("⛔ error in fetchProducts:", err.message);
    } finally {
      set({ loading: false });
    }
  },
}));
