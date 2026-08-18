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
      const user = session?.user || null;
      set({ user });
      return user;
    } catch (error) {
      console.error("Error fetching auth session:", error.message);
      set({ user: null });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  setUser: (user) => set({ user: user || null, loading: false }),

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null, loading: false });
  },

  signUpWithEmail: async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) throw error;

    // When email confirmation is enabled, Supabase returns a user but no session.
    const user = data?.session?.user || null;
    set({ user, loading: false });
    return { user: data?.user || null, session: data?.session || null };
  },

  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    const user = data?.user || null;
    set({ user, loading: false });
    return user;
  },

  signInWithGoogle: async () => {
    const redirectTo = typeof window !== "undefined" ? window.location.origin : undefined;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (error) throw error;
    return data;
  },
}));
