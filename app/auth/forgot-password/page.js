"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { sendPasswordReset } from "@/app/_lib/auth";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    try { await sendPasswordReset(email.trim()); setSent(true); }
    catch (err) { setError(err?.message || "We could not send the reset email."); }
    finally { setLoading(false); }
  }
  return <main className="forgot-page"><div className="forgot-top"><span>ESTEEHOUSE</span><span>ACCOUNT / RECOVERY</span></div><section className="forgot-card"><p className="forgot-kicker">PASSWORD RECOVERY</p><h1>Reset<br /><em>access.</em></h1>{sent ? <div className="forgot-success"><p>Check your inbox for the password reset link.</p><Link href="/auth/login">Return to sign in <ArrowUpRight size={15} /></Link></div> : <form onSubmit={submit}><label>Email address</label><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />{error && <p className="forgot-error">{error}</p>}<button disabled={loading}>{loading ? "Sending…" : "Send reset link"}<ArrowUpRight size={16} /></button></form>}<Link className="forgot-back" href="/auth/login">← Back to sign in</Link></section></main>;
}
