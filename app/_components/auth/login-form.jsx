"use client";

import { useAppearance } from "../../context/appearanceContext";

import { signInWithGoogle, signInWithProvider, signInWithEmail } from "@/app/_lib/auth";
import Link from "../ui/localized-link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/app/_lib/supabase";
import { useUser } from "@/app/context/userContext";
import { accountRequest, fetchAccount } from "@/app/_lib/account-request";
import { gsap } from "gsap";
import "./login-form.css";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="auth-provider-icon">
      <path fill="currentColor" d="M21.35 12.27c0-.71-.06-1.39-.18-2.04H12v3.86h5.24a4.48 4.48 0 0 1-1.94 2.94v2.44h3.14c1.84-1.7 2.91-4.2 2.91-7.2Z"/>
      <path fill="currentColor" d="M12 21.7c2.63 0 4.84-.87 6.45-2.36l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.52A9.74 9.74 0 0 0 12 21.7Z"/>
      <path fill="currentColor" d="M6.53 13.79a5.86 5.86 0 0 1 0-3.58V7.69H3.29a9.75 9.75 0 0 0 0 8.62l3.24-2.52Z"/>
      <path fill="currentColor" d="M12 6.18c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.83 3.26 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.71 5.39l3.24 2.52C7.3 7.9 9.46 6.18 12 6.18Z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="auth-provider-icon">
      <path fill="currentColor" d="M16.77 12.66c-.02-2.18 1.78-3.23 1.86-3.28a3.98 3.98 0 0 0-3.14-1.7c-1.32-.14-2.59.78-3.26.78-.68 0-1.73-.76-2.84-.74a4.19 4.19 0 0 0-3.52 2.15c-1.52 2.64-.39 6.53 1.09 8.66.74 1.04 1.59 2.2 2.72 2.16 1.09-.04 1.5-.69 2.82-.69 1.31 0 1.69.69 2.84.67 1.18-.02 1.91-1.06 2.64-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.38-.91-2.4-3.46ZM14.63 6.29c.59-.72.99-1.71.88-2.7-.85.04-1.88.57-2.49 1.29-.55.63-1.03 1.64-.9 2.6.95.07 1.92-.48 2.51-1.19Z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="auth-provider-icon">
      <path fill="currentColor" d="M13.8 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.66V3.63c-.29-.04-1.3-.13-2.47-.13-2.45 0-4.13 1.5-4.13 4.25v2.15H7.6V13h2.81v8h3.39Z"/>
    </svg>
  );
}


export default function LoginForm() {
  const { translateText, href } = useAppearance();
  const searchParams = useSearchParams();
  const { user, logout, signingOut } = useUser();

  const next = searchParams.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") && !next.includes(String.fromCharCode(92)) ? next : "/profile";
  const requestedAdmin = destination.split(/[?#]/)[0] === "/admin" || destination.startsWith("/admin/");
  const memberDestination = href(requestedAdmin ? "/profile" : destination);
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
  const [redirecting, setRedirecting] = useState(false);
  const [accountError, setAccountError] = useState("");
  const [retry, setRetry] = useState(0);

  const shellRef = useRef(null);
  const animationContext = useRef(null);
  const transitionRef = useRef(null);
  const curtainRef = useRef(null);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const animatingRef = useRef(false);

  async function isAdmin() {
    const { data: { session }, error: sessionError } = await accountRequest(() => supabase.auth.getSession());
    if (sessionError) throw sessionError;
    if (!session?.access_token) throw new Error("Your session could not be verified. Please sign in again.");

    const response = await fetchAccount("/api/admin/me", {
      headers: { Authorization: "Bearer " + session.access_token },
      cache: "no-store",
    });

    if (response.status === 403) return false;
    if (!response.ok) throw new Error("Your session could not be verified. Please sign in again.");
    return true;
  }

  useEffect(() => {
    if (!user) {
      setRedirecting(false);
      return;
    }

    let cancelled = false;
    setRedirecting(true);
    setAccountError("");

    (async () => {
      try {
        const admin = await isAdmin();
        if (!cancelled) {
          window.location.replace(admin ? "/admin" : memberDestination);
        }
      } catch (requestError) {
        if (!cancelled) {
          setAccountError(translateText(requestError.message || "Could not open your account."));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, memberDestination, translateText, retry]);

  useEffect(() => {
    if (!shellRef.current || !curtainRef.current || !loginRef.current || !registerRef.current) return;
    const target = searchParams.get("mode") === "register" ? "register" : "login";
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add({ compact: "(max-width: 800px)", wide: "(min-width: 801px)" }, (match) => {
        transitionRef.current?.kill();
        animatingRef.current = false;
        setMode(target);
        const register = target === "register";
        gsap.set(curtainRef.current, { x: 0, xPercent: register ? 100 : match.conditions.compact ? -100 : 0, scaleX: 1, skewX: 0 });
        gsap.set(curtainRef.current.querySelector(".auth-curtain-face"), { xPercent: 0 });
        gsap.set(loginRef.current, { autoAlpha: register ? 0 : 1 });
        gsap.set(registerRef.current, { autoAlpha: register ? 1 : 0 });
        gsap.set([loginRef.current.querySelector(".auth-card"), registerRef.current.querySelector(".auth-card")], { opacity: 1, x: 0, y: 0, scale: 1 });
      });
    }, shellRef);
    animationContext.current = context;
    return () => {
      transitionRef.current?.kill();
      context.revert();
      animationContext.current = null;
      animatingRef.current = false;
    };
  }, [searchParams, redirecting]);

  function updateUrl(nextMode) {
    const params = new URLSearchParams();
    if (nextMode === "register") params.set("mode", "register");
    if (next) params.set("next", next);
    window.history.replaceState({}, "", href("/auth/login" + (params.toString() ? "?" + params.toString() : "")));
  }

  function flip(nextMode, { clearMessages = true } = {}) {
    if (nextMode === mode || animatingRef.current) return;
    if (clearMessages) {
      setError("");
      setMessage("");
    }
    const curtain = curtainRef.current;
    const oldPanel = mode === "register" ? registerRef.current : loginRef.current;
    const newPanel = nextMode === "register" ? registerRef.current : loginRef.current;
    if (!curtain || !oldPanel || !newPanel || !animationContext.current) {
      setMode(nextMode);
      updateUrl(nextMode);
      return;
    }
    const compact = window.matchMedia("(max-width: 800px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const direction = nextMode === "register" ? 1 : -1;
    const targetPosition = nextMode === "register" ? 100 : compact ? -100 : 0;
    const oldCard = oldPanel.querySelector(".auth-card");
    const newCard = newPanel.querySelector(".auth-card");
    const curtainFace = curtain.querySelector(".auth-curtain-face");
    animatingRef.current = true;
    setMode(nextMode);
    newPanel.scrollTop = 0;
    const finish = () => {
      gsap.set(oldPanel, { autoAlpha: 0 });
      gsap.set(newPanel, { autoAlpha: 1 });
      animatingRef.current = false;
      updateUrl(nextMode);
      newPanel.querySelector("h1")?.focus({ preventScroll: true });
    };
    animationContext.current.add(() => {
      if (reduced) {
        gsap.set(curtain, { xPercent: targetPosition, scaleX: 1, skewX: 0 });
        finish();
        return;
      }
      gsap.set(newPanel, { autoAlpha: 1 });
      gsap.set(newCard, { opacity: 0, x: -direction * 24, y: 12, scale: .99 });
      transitionRef.current = gsap.timeline({
        defaults: { overwrite: "auto", ease: "power3.inOut" },
        onComplete: finish,
      })
        .to(oldCard, { opacity: 0, x: direction * 18, y: -6, duration: .3 }, 0)
        .to(curtain, { xPercent: targetPosition, duration: 1.1 }, .04)
        .to(curtain, { scaleX: 1.045, skewX: direction * .6, duration: .48 }, .04)
        .to(curtainFace, { xPercent: -direction * 5, duration: .5 }, .04)
        .to(curtain, { scaleX: 1, skewX: 0, duration: .58 }, .52)
        .to(curtainFace, { xPercent: 0, duration: .6 }, .5)
        .to(newCard, { opacity: 1, x: 0, y: 0, scale: 1, duration: .64, ease: "power3.out" }, .54);
    });
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmail(email.trim(), password);
    } catch (err) {
      setError(err?.message || translateText("We could not sign you in. Check your email and password."));
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
      if (!name.trim()) throw new Error(translateText("Your name is required."));

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
        return;
      }

      setMessage(translateText("Your account is created. Check your email to confirm it, then sign in."));
      flip("login", { clearMessages: false });
    } catch (err) {
      setError(err?.message || translateText("We could not create your account."));
    } finally {
      setLoading(false);
    }
  }

  async function handleSocial(provider) {
    setError("");
    setMessage("");
    setGoogleLoading(true);

    try {
      if (provider === "google") {
        await signInWithGoogle(destination);
      } else {
        await signInWithProvider(provider, destination);
      }
    } catch (err) {
      setError(err?.message || translateText("Social sign-in could not be started."));
      setGoogleLoading(false);
    }
  }

  function renderPanel(isRegister) {
    return (
      <section className="auth-card">
        <div className="auth-heading">
          <p className="auth-kicker">{isRegister ? translateText("WELCOME IN") : translateText("WELCOME BACK")}</p>
          <h1 tabIndex={-1}>{isRegister ? translateText("Sign up.") : translateText("Sign in.")}</h1>
          <p className="auth-copy">
            {isRegister
              ? translateText("Create your EsteeHouse account and keep your details in one place.")
              : translateText("Sign in to manage your EsteeHouse account, orders, and profile.")}
          </p>
        </div>

        <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form">
          {isRegister && (
            <label>
              <span>{translateText("Name")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={translateText("Your name")} required />
            </label>
          )}

          <label>
            <span>{translateText("Email address")}</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>

          <label>
            <span>{translateText("Password")}</span>
            <div className="auth-password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete={isRegister ? "new-password" : "current-password"}
                placeholder={translateText("Your password")}
                minLength={6}
                required
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? translateText("Hide password") : translateText("Show password")}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          {!isRegister && (
            <div className="auth-forgot">
              <Link href="/auth/forgot-password">{translateText("Forgot password?")}</Link>
            </div>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}

          <button className="auth-primary" type="submit" disabled={loading}>
            {loading
              ? (isRegister ? translateText("Creating account…") : translateText("Signing in…"))
              : (isRegister ? translateText("Create account") : translateText("Sign in"))}
            <ArrowUpRight size={16} />
          </button>
        </form>

        <div className="auth-divider"><span>{translateText("OR")}</span></div>

        <div className="auth-social-heading">{translateText("SIGN IN WITH")}</div>
        <div className="auth-socials">
          <button className="auth-social-button" type="button" onClick={() => handleSocial("google")} disabled={googleLoading} aria-label={translateText("Continue with Google")}>
            <GoogleIcon />
            <span>Google</span>
          </button>
          <button className="auth-social-button" type="button" onClick={() => handleSocial("apple")} disabled={googleLoading} aria-label={translateText("Continue with Apple")}>
            <AppleIcon />
            <span>Apple</span>
          </button>
          <button className="auth-social-button" type="button" onClick={() => handleSocial("facebook")} disabled={googleLoading} aria-label={translateText("Continue with Facebook")}>
            <FacebookIcon />
            <span>Facebook</span>
          </button>
        </div>

        <div className="auth-foot">
          <button
            type="button"
            className="auth-switch"
            onClick={() => flip(isRegister ? "login" : "register")}
          >
            {isRegister ? translateText("Already have an account? Sign in") : translateText("New here? Create an account")}
          </button>
        </div>
      </section>
    );
  }

  if (redirecting) {
    return (
      <main className="auth-shell auth-redirecting" aria-live="polite">
        <Link href="/" className="auth-home" aria-label={translateText("Back to EsteeHouse home", "EsteeHouse ana sayfasına dön")}><ArrowLeft size={14}/><span>{translateText("Home", "Ana sayfa")}</span></Link>
        <div className="auth-redirect-message">
          <span>ESTEEHOUSE</span>
          <small role={accountError ? "alert" : undefined}>{accountError || translateText("Opening your account…")}</small>
          {accountError && <div className="auth-redirect-actions"><button type="button" onClick={() => setRetry((current) => current + 1)}>{translateText("Try again", "Tekrar dene")}</button><button type="button" onClick={logout} disabled={signingOut}>{translateText("Sign out")}</button></div>}
        </div>
      </main>
    );
  }

  const isRegister = mode === "register";

  return (
    <main ref={shellRef} className="auth-shell" data-mode={mode}>
      <Link href="/" className="auth-home" aria-label={translateText("Back to EsteeHouse home", "EsteeHouse ana sayfasına dön")}><ArrowLeft size={14}/><span>{translateText("Home", "Ana sayfa")}</span></Link>
      <div className="auth-stage">
        <section ref={registerRef} className="auth-panel auth-register-panel" aria-hidden={!isRegister} inert={!isRegister}>
          {renderPanel(true)}
        </section>

        <section ref={loginRef} className="auth-panel auth-login-panel" aria-hidden={isRegister} inert={isRegister}>
          {renderPanel(false)}
        </section>

        <div ref={curtainRef} className="auth-curtain" aria-hidden="true">
          <div className="auth-curtain-face">
            <div className="auth-meta"><span>{translateText("01 / ACCOUNT")}</span></div>
            <div className="auth-brand">
              <p>{translateText("Two collections.")}<br />{translateText("One house.")}</p>
              <span>{translateText("EST. / HANDMADE")}</span>
            </div>
            <div className="auth-meta"><span>ISTANBUL / 2026</span><span>{translateText("HANDMADE OBJECTS")}</span></div>
          </div>
        </div>

      </div>
    </main>
  );
}
