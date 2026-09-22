"use client";

import { signInWithGoogle, signInWithEmail } from "@/app/_lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/app/_lib/supabase";
import { useUser } from "@/app/context/userContext";
import "./login-form.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const next = searchParams.get("next");
  const destination = next && next.startsWith("/") ? next : "/profile";

  useEffect(() => {
    setMode(searchParams.get("mode") === "register" ? "register" : "login");
  }, [searchParams]);

  async function isAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return false;
    const response = await fetch("/api/admin/me", { headers: { Authorization: "Bearer " + session.access_token }, cache: "no-store" });
    return response.ok;
  }

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      if (await isAdmin() && !cancelled) router.replace("/admin");
    })();
    return () => { cancelled = true; };
  }, [user]);

  function flip(nextMode) {
    setError("");
    setMessage("");
    setMode(nextMode);
    const params = new URLSearchParams();
    params.set("mode", nextMode);
    if (next) params.set("next", next);
    window.history.replaceState({}, "", "/auth/login?" + params.toString());
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      const admin = await isAdmin();
      router.replace(admin ? "/admin" : destination);
      router.refresh();
    } catch (err) {
      setError(err?.message || "We could not sign you in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (!name.trim()) throw new Error("Your name is required.");
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() },
          emailRedirectTo: siteUrl + "/auth/login",
        },
      });
      if (signUpError) throw signUpError;
      if (data.session) {
        router.replace("/profile");
        router.refresh();
        return;
      }
      setMessage("Your account is created. Check your email to confirm it, then sign in.");
      setMode("login");
      const params = new URLSearchParams(); if (next) params.set("next", next); window.history.replaceState({}, "", "/auth/login" + (params.toString() ? "?" + params.toString() : ""));
    } catch (err) {
      setError(err?.message || "We could not create your account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setMessage("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle(destination);
    } catch (err) {
      setError(err?.message || "Google sign-in could not be started.");
      setGoogleLoading(false);
    }
  }

  if (user) {
    const displayName = user.user_metadata?.full_name || user.email;
    return <div className="auth-shell"><div className="auth-card auth-signed-card"><p className="auth-kicker">ESTEEHOUSE / ACCOUNT</p><h1>You are in.</h1><p className="auth-copy">Signed in as {displayName}.</p><button className="auth-primary" type="button" onClick={async () => router.replace(await isAdmin() ? "/admin" : destination)}>Continue <ArrowUpRight size={16}/></button></div></div>;
  }

  const isRegister = mode === "register";
  return <main className="auth-shell">
    <div className={"auth-paper " + (isRegister ? "is-register" : "is-login")}>
      <div className="auth-side">
        <div><span>ESTEEHOUSE</span><span>01 / ACCOUNT</span></div>
        <div className="auth-side-copy"><p>Two collections.<br />One house.</p><small>{isRegister ? "Create a customer account to follow orders, save details and continue your collection." : "Sign in to follow orders, save your details and continue your collection."}</small></div>
        <div><span>ISTANBUL / 2026</span><span>EST. / HANDMADE</span></div>
      </div>
      <section className="auth-card">
        <div className="auth-heading"><p className="auth-kicker">{isRegister ? "WELCOME IN" : "WELCOME BACK"}</p><h1>{isRegister ? "Sign up." : "Sign in."}</h1><p className="auth-copy">{isRegister ? "Create your customer account. No passport or ID is needed for account creation." : "Use your customer account or your authorised admin account."}</p></div>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form">
          {isRegister && <label><span>Name</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" required /></label>}
          <label><span>Email address</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" required /></label>
          <label><span>Password</span><div className="auth-password"><input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? "text" : "password"} autoComplete={isRegister ? "new-password" : "current-password"} placeholder="Your password" minLength={6} required /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></div></label>
          {!isRegister && <div className="auth-forgot"><Link href="/auth/forgot-password">Forgot password?</Link></div>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}
          <button className="auth-primary" type="submit" disabled={loading}>{loading ? (isRegister ? "Creating account…" : "Signing in…") : (isRegister ? "Create account" : "Sign in")}<ArrowUpRight size={16}/></button>
        </form>
        <div className="auth-divider"><span>OR</span></div>
        <button className="auth-google" type="button" onClick={handleGoogle} disabled={googleLoading}>{googleLoading ? "Opening Google…" : "Continue with Google"}</button>
        <div className="auth-foot"><button type="button" className="auth-switch" onClick={() => flip(isRegister ? "login" : "register")}>{isRegister ? "Already have an account? Sign in" : "Create a customer account"}</button>{!isRegister && destination === "/admin" && <span>Admin access is enforced server-side by the authorised admin email.</span>}</div>
      </section>
    </div>
  </main>;
}
