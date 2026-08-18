import { create } from "zustand";
import { supabase } from "@/app/_lib/supabase";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      const { data, error } = await supabase.from("products").select(`
        id,
        name,
        price,
        stock,
        material,
        categories:categoriy_id (
          id,
          title,
          image_url
        ),
        product_images (
          id,
          image_url,
          is_primary
        )
      `);

      if (error) throw error;
      set({ products: data || [], error: null });
    } catch (err) {
      console.error("Product fetch error:", err.message);
      set({ products: [], error: err.message });
    } finally {
      set({ loading: false });
    }
  },
}));
