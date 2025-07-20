import { create } from "zustand";
import { supabase } from "./supabase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    set({ loading: true });
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      set({ user: session?.user || null });
    } catch (error) {
      console.error("Error fetching user:", error.message);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
    } catch (err) {
      console.error("Error logging out:", err.message);
      throw err;
    }
  },

  // ✅ Sign In
  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      coansole.error("Login error", error.message);
    }
    set({ user: data.user || null });
    console.log("Login result", data);
    return data.user;
  },

  // ✅ Sign Up
  signUpWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    set({ user: data?.user || null });
    return data.user;
  },

  // ✅ Google login
  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) throw error;
    return data; // redirect URL handled by Supabase
  },
}));
