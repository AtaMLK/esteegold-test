"use client";

import { signInWithGoogle, signInWithEmail } from "@/app/_lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/app/_lib/supabase";
import { useUser } from "@/app/context/userContext";
import { gsap } from "gsap";
import "./login-form.css";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  const next = searchParams.get("next");
  const destination = next && next.startsWith("/") ? next : "/profile";
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

  const curtainRef = useRef(null);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const animatingRef = useRef(false);

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
      const admin = await isAdmin();
      if (!cancelled) {
        router.replace(admin ? "/admin" : destination);
        router.refresh();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, destination, router]);

  useEffect(() => {
    const target = searchParams.get("mode") === "register" ? "register" : "login";
    setMode(target);

    if (!curtainRef.current || !loginRef.current || !registerRef.current) return;

    gsap.killTweensOf([curtainRef.current, loginRef.current, registerRef.current]);

    if (target === "register") {
      gsap.set(curtainRef.current, { xPercent: 100, rotationY: 0, rotationZ: 0 });
      gsap.set(loginRef.current, { opacity: 0, x: 24 });
      gsap.set(registerRef.current, { opacity: 1, x: 0 });
    } else {
      gsap.set(curtainRef.current, { xPercent: 0, rotationY: 0, rotationZ: 0 });
      gsap.set(loginRef.current, { opacity: 1, x: 0 });
      gsap.set(registerRef.current, { opacity: 0, x: -24 });
    }
  }, [searchParams]);

  function updateUrl(nextMode) {
    const params = new URLSearchParams();
    if (nextMode === "register") params.set("mode", "register");
    if (next) params.set("next", next);
    window.history.replaceState(
      {},
      "",
      "/auth/login" + (params.toString() ? "?" + params.toString() : "")
    );
  }

  function flip(nextMode) {
    if (nextMode === mode || animatingRef.current) return;

    setError("");
    setMessage("");
    setMode(nextMode);
    updateUrl(nextMode);
    animatingRef.current = true;

    const toRegister = nextMode === "register";
    const timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        animatingRef.current = false;
      },
    });

    if (toRegister) {
      timeline
        .to(loginRef.current, {
          opacity: 0,
          x: 28,
          duration: 0.38,
          ease: "power2.in",
        }, 0)
        .set(registerRef.current, { opacity: 1, x: -28 }, 0.32)
        .to(curtainRef.current, {
          xPercent: 100,
          rotationY: -7,
          rotationZ: -0.35,
          duration: 1.15,
          ease: "power4.inOut",
        }, 0.05)
        .to(registerRef.current, {
          x: 0,
          duration: 0.65,
          ease: "power3.out",
        }, 0.62)
        .to(curtainRef.current, {
          rotationY: 0,
          rotationZ: 0,
          duration: 0.22,
          ease: "power2.out",
        }, 1.02);
    } else {
      timeline
        .to(registerRef.current, {
          opacity: 0,
          x: -28,
          duration: 0.38,
          ease: "power2.in",
        }, 0)
        .set(loginRef.current, { opacity: 1, x: 28 }, 0.32)
        .to(curtainRef.current, {
          xPercent: 0,
          rotationY: 7,
          rotationZ: 0.35,
          duration: 1.15,
          ease: "power4.inOut",
        }, 0.05)
        .to(loginRef.current, {
          x: 0,
          duration: 0.65,
          ease: "power3.out",
        }, 0.62)
        .to(curtainRef.current, {
          rotationY: 0,
          rotationZ: 0,
          duration: 0.22,
          ease: "power2.out",
        }, 1.02);
    }
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

  function renderPanel(isRegister) {
    return (
      <section className="auth-card">
        <div className="auth-heading">
          <p className="auth-kicker">{isRegister ? "WELCOME IN" : "WELCOME BACK"}</p>
          <h1>{isRegister ? "Sign up." : "Sign in."}</h1>
          <p className="auth-copy">
            {isRegister
              ? "Create your account. No passport or ID is needed."
              : "Use your customer account or your authorised admin account."}
          </p>
        </div>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form">
          {isRegister && (
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
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder="Your password"
                minLength={6}
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {!isRegister && (
            <div className="auth-forgot">
              <Link href="/auth/forgot-password">Forgot password?</Link>
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading
              ? (isRegister ? "Creating account…" : "Signing in…")
              : (isRegister ? "Create account" : "Sign in")}
            <ArrowUpRight size={16} />
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button className="auth-google" type="button" onClick={handleGoogle} disabled={googleLoading}>
          {googleLoading ? "Opening Google…" : "Continue with Google"}
        </button>

        <div className="auth-foot">
          <button
            type="button"
            className="auth-switch"
            onClick={() => flip(isRegister ? "login" : "register")}
          >
            {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </div>
      </section>
    );
  }

  if (user) return null;

  const isRegister = mode === "register";

  return (
    <main className="auth-shell">
      <div className="auth-stage">
        <section ref={registerRef} className="auth-panel auth-register-panel" aria-hidden={!isRegister}>
          {renderPanel(true)}
        </section>

        <section ref={loginRef} className="auth-panel auth-login-panel" aria-hidden={isRegister}>
          {renderPanel(false)}
        </section>

        <div ref={curtainRef} className="auth-curtain" aria-hidden="true">
          <div className="auth-curtain-face">
            <div className="auth-meta"><span>ESTEEHOUSE</span><span>01 / ACCOUNT</span></div>
            <div className="auth-brand">
              <p>Two collections.<br />One house.</p>
              <span>EST. / HANDMADE</span>
            </div>
            <div className="auth-meta"><span>ISTANBUL / 2026</span><span>HANDMADE OBJECTS</span></div>
          </div>
        </div>

        <div className="auth-corner">
          <span>ESTEEHOUSE</span>
          <span>{isRegister ? "02 / JOIN" : "01 / ACCOUNT"}</span>
        </div>
      </div>
    </main>
  );
}
