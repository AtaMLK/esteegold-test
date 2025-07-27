import { create } from "zustand";
import { supabase } from "./supabase";
import { toast } from "@/hooks/use-toast";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          price,
          material,
          stock,
          description,
          product_images (
            id,
            image_url,
            is_primary
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error.message);
        toast({
          title: "Error fetching products",
          description: error.message,
          // you can add more toast options here
        });
        set({ loading: false });
      } else {
        set({ products: data || [], loading: false });
        // Optional success toast:
        // toast({ title: "Products loaded successfully" });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Unexpected error",
        description: err.message || String(err),
      });
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Error deleting product:", error.message);
        toast({
          title: "Error deleting product",
          description: error.message,
        });
      } else {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
        toast({
          title: "Product deleted",
          description: "The product was deleted successfully.",
        });
      }
    } catch (err) {
      console.error("Unexpected error during delete:", err);
      toast({
        title: "Unexpected error",
        description: err.message || String(err),
      });
    }
  },
}));
