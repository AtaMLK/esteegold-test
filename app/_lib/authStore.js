import { create } from "zustand";
import { supabase } from "./supabase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;
      set({ user: user || null });
      return user || null;
    } catch (error) {
      console.error("Error fetching user:", error.message);
      set({ user: null });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },

  signUpWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    set({ user: data?.user || null });
    return data?.user || null;
  },

  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data?.user || null });
    return data?.user || null;
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
    return data;
  },
}));
