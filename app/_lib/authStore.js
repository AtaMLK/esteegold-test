import { create } from "zustand";
import { supabase } from "./supabase";

export const useAuthStore = create((set) => {
  // Store the unsubscribe function for auth listener
  let unsubscribe = null;

  return {
    user: null, // Holds the current logged-in user info
    

    // Register listener for auth state changes
    fetchUser: () => {
      // If there's an existing listener, unsubscribe it first
      if (unsubscribe) unsubscribe();

      // Listen for changes in auth state (login, logout, token refresh, etc.)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          // If session has a valid user, update the store
          set({ user: session.user });
        } else {
          // No valid user session, clear user info
          set({ user: null });
        }
      });
      unsubscribe = subscription.unsubscribe;
    },

    // Logout the current user
    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null });
    },

    // Sign in with email and password
    signInWithEmail: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("Login error", error.message);
        return null;
      }
      set({ user: data.user || null });
      return data.user;
    },

    // Sign up with email and password
    signUpWithEmail: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Signup error", error.message);
        return null;
      }
      set({ user: data.user || null });
      return data.user;
    },

    // Sign in with Google OAuth provider
    signInWithGoogle: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        console.error("Google sign-in error", error.message);
        return null;
      }
      return data; // Supabase handles redirect automatically
    },
  };
});
