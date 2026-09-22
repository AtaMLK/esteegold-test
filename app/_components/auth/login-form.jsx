"use client";

import { signInWithGoogle, signInWithEmail } from "@/app/_lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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
  const sideRef = useRef(null);
  const loginPanelRef = useRef(null);
  const registerPanelRef = useRef(null);
  const flipTimeline = useRef(null);
  const internalModeChange = useRef(false);

  useEffect(() => {
    const nextMode = searchParams.get("mode") === "register" ? "register" : "login";
    setMode(nextMode);
    if (!sideRef.current) return;

    gsap.set(sideRef.current, {
      xPercent: nextMode === "register" ? 100 : 0,
      rotationY: nextMode === "register" ? -178 : 0,
      rotationX: nextMode === "register" ? -1.5 : 0,
      rotationZ: nextMode === "register" ? -0.7 : 0,
      skewY: nextMode === "register" ? -1.2 : 0,
      transformOrigin: "left center",
    });
    gsap.set(loginPanelRef.current, { autoAlpha: nextMode === "login" ? 1 : 0, x: 0 });
    gsap.set(registerPanelRef.current, { autoAlpha: nextMode === "register" ? 1 : 0, x: 0 });
  }, [searchParams]);

  async function isAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return false;
    const response = await fetch("/api/admin/me", {
      headers: { Authorization: "Bearer " + session.access_token },
      cache: "no-store",
    });
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
    if (flipTimeline.current?.isActive() || nextMode === mode) return;

    setError("");
    setMessage("");
    setMode(nextMode);

    const params = new URLSearchParams();
    if (nextMode === "register") params.set("mode", "register");
    if (next) params.set("next", next);
    internalModeChange.current = true;
    window.history.replaceState(
      {},
      "",
      "/auth/login" + (params.toString() ? "?" + params.toString() : "")
    );

    const side = sideRef.current;
    const loginPanel = loginPanelRef.current;
    const registerPanel = registerPanelRef.current;
    if (!side || !loginPanel || !registerPanel) return;

    const showingRegister = nextMode === "register";
    const incoming = showingRegister ? registerPanel : loginPanel;
    const outgoing = showingRegister ? loginPanel : registerPanel;

    gsap.killTweensOf([side, loginPanel, registerPanel]);
    gsap.set(incoming, { autoAlpha: 0, x: showingRegister ? -28 : 28 });
    gsap.set(outgoing, { autoAlpha: 0 });

    const tl = gsap.timeline({
      onComplete: () => { flipTimeline.current = null; },
    });
    flipTimeline.current = tl;

    tl.to(side, {
      xPercent: showingRegister ? 100 : 0,
      rotationY: showingRegister ? -178 : 0,
      rotationX: showingRegister ? -2 : 0,
      rotationZ: showingRegister ? -0.8 : 0,
      skewY: showingRegister ? -1.2 : 0,
      borderRadius: showingRegister ? "0 3% 2% 0" : "0",
      boxShadow: showingRegister ? "24px 14px 50px rgba(0,0,0,.24)" : "0 0 0 rgba(0,0,0,0)",
      duration: 1.35,
      ease: "power4.inOut",
    }, 0)
      .to(side, {
        rotationY: showingRegister ? -186 : 6,
        rotationX: showingRegister ? 1.5 : -1.5,
        rotationZ: showingRegister ? 0.5 : 0.5,
        skewY: showingRegister ? 0.8 : 0,
        duration: 0.28,
        ease: "power2.out",
      }, 0.62)
      .to(side, {
        rotationY: showingRegister ? -178 : 0,
        rotationX: showingRegister ? -2 : 0,
        rotationZ: showingRegister ? -0.8 : 0,
        skewY: showingRegister ? -1.2 : 0,
        duration: 0.28,
        ease: "power2.inOut",
      }, 0.9)
      .to(incoming, {
        autoAlpha: 1,
        x: 0,
        duration: 0.62,
        ease: "power2.out",
      }, 0.72);
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
      flip("login");
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
    return (
      <div className="auth-shell">
        <div className="auth-card auth-signed-card">
          <p className="auth-kicker">ESTEEHOUSE / ACCOUNT</p>
          <h1>You are in.</h1>
          <p className="auth-copy">Signed in as {displayName}.</p>
          <button
            className="auth-primary"
            type="button"
            onClick={async () => router.replace(await isAdmin() ? "/admin" : destination)}
          >
            Continue <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  const isRegister = mode === "register";

  function renderPanel(register) {
    return (
      <section
        className={"auth-card auth-form-panel " + (register ? "register-panel" : "login-panel")}
        ref={register ? registerPanelRef : loginPanelRef}
        aria-hidden={register !== isRegister}
      >
        <div className="auth-heading">
          <p className="auth-kicker">{register ? "WELCOME IN" : "WELCOME BACK"}</p>
          <h1>{register ? "Sign up." : "Sign in."}</h1>
          <p className="auth-copy">
            {register
              ? "Create your account. No passport or ID is needed."
              : "Use your customer account or your authorised admin account."}
          </p>
        </div>

        <form onSubmit={register ? handleRegister : handleLogin} className="auth-form">
          {register && (
            <label>
              <span>Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" required />
            </label>
          )}

          <label>
            <span>Email address</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>

          <label>
            <span>Password</span>
            <div className="auth-password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                placeholder="Your password"
                minLength={6}
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {!register && (
            <div className="auth-forgot">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading ? (register ? "Creating account…" : "Signing in…") : (register ? "Create account" : "Sign in")}
            <ArrowUpRight size={16} />
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button className="auth-google" type="button" onClick={handleGoogle} disabled={googleLoading}>
          {googleLoading ? "Opening Google…" : "Continue with Google"}
        </button>

        <div className="auth-foot">
          <button type="button" className="auth-switch" onClick={() => flip(register ? "login" : "register")}>
            {register ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
          {!register && destination === "/admin" && (
            <span>Admin access is enforced server-side by the authorised admin email.</span>
          )}
        </div>
      </section>
    );
  }

  return (
    <main className="auth-shell">
      <div className="auth-paper">
        <div className="auth-side" ref={sideRef}>
          <div><span>ESTEEHOUSE</span><span>01 / ACCOUNT</span></div>
          <div className="auth-side-copy">
            <p>Two collections.<br />One house.</p>
            <small>
              {isRegister
                ? "Create your account to follow orders, save your details and continue your collection."
                : "Sign in to follow orders, save your details and continue your collection."}
            </small>
          </div>
          <div><span>ISTANBUL / 2026</span><span>EST. / HANDMADE</span></div>
        </div>

        <div className="auth-panel-stage">
          {renderPanel(false)}
          {renderPanel(true)}
        </div>
      </div>
    </main>
  );
}
