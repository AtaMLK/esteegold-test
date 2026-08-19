"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { updatePassword } from "@/app/_lib/auth";
import "./reset-password.css";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [loading, setLoading] = useState(false); const [done, setDone] = useState(false); const [error, setError] = useState("");
  useEffect(() => { const { data: listener } = supabase.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true); }); supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session))); return () => listener.subscription.unsubscribe(); }, []);
  async function submit(event) { event.preventDefault(); setError(""); if (password.length < 8) return setError("Use at least 8 characters."); if (password !== confirm) return setError("Passwords do not match."); setLoading(true); try { await updatePassword(password); setDone(true); } catch (err) { setError(err?.message || "Could not update the password."); } finally { setLoading(false); } }
  return <main className="reset-page"><div className="reset-top"><span>ESTEEHOUSE</span><span>ACCOUNT / RESET</span></div><section className="reset-card"><p className="reset-kicker">NEW PASSWORD</p><h1>Set it<br /><em>again.</em></h1>{done ? <div className="reset-success"><p>Your password has been updated.</p><Link href="/profile">Continue to your account <ArrowUpRight size={15} /></Link></div> : !ready ? <p className="reset-wait">Open the reset link from your email to continue.</p> : <form onSubmit={submit}><label>New password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" /></label><label>Confirm password<input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" placeholder="Repeat password" /></label>{error && <p className="reset-error">{error}</p>}<button disabled={loading}>{loading ? "Updating…" : "Update password"}<ArrowUpRight size={16} /></button></form>}<Link className="reset-back" href="/auth/login">← Back to sign in</Link></section></main>;
}
