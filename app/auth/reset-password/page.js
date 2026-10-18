"use client";

import { useAppearance } from "../../context/appearanceContext";

import Link from "../../_components/ui/localized-link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { updatePassword } from "@/app/_lib/auth";
import "./reset-password.css";

export default function ResetPasswordPage() {
  const { translateText } = useAppearance();
  const [ready, setReady] = useState(false); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [loading, setLoading] = useState(false); const [done, setDone] = useState(false); const [error, setError] = useState("");
  useEffect(() => { const { data: listener } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true); }); supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session))); return () => listener.subscription.unsubscribe(); }, []);
  async function submit(event) { event.preventDefault(); setError(""); if (password.length < 8) return setError(translateText("Use at least 8 characters.")); if (password !== confirm) return setError(translateText("Passwords do not match.")); setLoading(true); try { await updatePassword(password); setDone(true); } catch (err) { setError(err?.message || translateText("Could not update the password.")); } finally { setLoading(false); } }
  return <main className="reset-page"><div className="reset-top"><span>ESTEEHOUSE</span><span>{translateText("ACCOUNT / RESET")}</span></div><section className="reset-card"><p className="reset-kicker">{translateText("NEW PASSWORD")}</p><h1>{translateText("Set it")}<br /><em>{translateText("again.")}</em></h1>{done ? <div className="reset-success"><p>{translateText("Your password has been updated.")}</p><Link href="/profile">{translateText("Continue to your account")}<ArrowUpRight size={15} /></Link></div> : !ready ? <p className="reset-wait">{translateText("Open the reset link from your email to continue.")}</p> : <form onSubmit={submit}><label>{translateText("New password")}<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder={translateText("At least 8 characters")} /></label><label>{translateText("Confirm password")}<input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" placeholder={translateText("Repeat password")} /></label>{error && <p className="reset-error">{error}</p>}<button disabled={loading}>{loading ? translateText("Updating…") : translateText("Update password")}<ArrowUpRight size={16} /></button></form>}<Link className="reset-back" href="/auth/login">{translateText("← Back to sign in")}</Link></section></main>;
}
