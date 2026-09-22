import { supabase } from "./supabase";

export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInWithProvider(provider, redirectTo = "/profile") {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const safePath = redirectTo?.startsWith("/") ? redirectTo : "/profile";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: origin + safePath },
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle(redirectTo = "/profile") {
  return signInWithProvider("google", redirectTo);
}

export async function sendPasswordReset(email) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/auth/reset-password` });
  if (error) throw error;
}

export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
