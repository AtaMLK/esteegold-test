"use client";

import { signInWithGoogle, signInWithEmail } from "@/app/_lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/app/_lib/supabase";
import { useUser } from "@/app/context/userContext";
import "./login-form.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); const [googleLoading, setGoogleLoading] = useState(false); const [error, setError] = useState("");
  const next = searchParams.get("next"); const destination = next && next.startsWith("/") ? next : "/profile";

  async function isAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return false;
    const response = await fetch("/api/admin/me", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
    return response.ok;
  }

  async function handleSubmit(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      const admin = await isAdmin();
      router.replace(admin ? "/admin" : destination);
      router.refresh();
    } catch (err) { setError(err?.message || "We could not sign you in. Check your email and password."); }
    finally { setLoading(false); }
  }

  async function handleGoogle() {
    setError(""); setGoogleLoading(true);
    try { await signInWithGoogle(destination); }
    catch (err) { setError(err?.message || "Google sign-in could not be started."); setGoogleLoading(false); }
  }

  if (user) return <div className="auth-shell"><div className="auth-card"><p className="auth-kicker">ESTEEHOUSE / ACCOUNT</p><h1>Already signed in.</h1><p className="auth-copy">You are signed in as {user.email}.</p><Link className="auth-primary" href={destination}>Continue <ArrowUpRight size={16} /></Link></div></div>;

  return <main className="auth-shell">
    <div className="auth-side"><div><span>ESTEEHOUSE</span><span>01 / ACCOUNT</span></div><div className="auth-side-copy"><p>Two collections.<br />One house.</p><small>Sign in to follow orders, save your details and continue your collection.</small></div><div><span>ISTANBUL / 2026</span><span>EST. / HANDMADE</span></div></div>
    <section className="auth-card">
      <div className="auth-heading"><p className="auth-kicker">WELCOME BACK</p><h1>Sign in.</h1><p className="auth-copy">Use your customer account or your authorised admin account.</p></div>
      <form onSubmit={handleSubmit} className="auth-form">
        <label><span>Email address</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label><span>Password</span><div className="auth-password"><input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Your password" required /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
        <div className="auth-forgot"><Link href="/auth/forgot-password">Forgot password?</Link></div>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="auth-primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowUpRight size={16} /></button>
      </form>
      <div className="auth-divider"><span>OR</span></div><button className="auth-google" type="button" onClick={handleGoogle} disabled={googleLoading}>{googleLoading ? "Opening Google…" : "Continue with Google"}</button>
      <div className="auth-foot"><div><Link href="/auth/register">Create a customer account</Link><br /><Link href="/auth/login?next=/admin">Admin sign in</Link></div><span>Admin access is enforced server-side by the authorised admin email.</span></div>
    </section>
  </main>;
}
