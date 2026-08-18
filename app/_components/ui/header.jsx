"use client";

import "@/styles/styles.css";
import gsap from "gsap";
import { LucideShoppingBag, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Menu from "./menu";
import { useAuthStore } from "@/app/_lib/authStore";
import { supabase } from "@/app/_lib/supabase";

function Header() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const pathname = usePathname();
  const hasAnimatedRef = useRef(false);
  const searchRef = useRef(null);
  const titleRef = useRef(null);
  const mainRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        useAuthStore.getState().setUser(session?.user || null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  useEffect(() => {
    if (pathname !== "/" || hasAnimatedRef.current) {
      window.scrollTo(0, 0);
      gsap.set(
        [mainRef.current, titleRef.current, searchRef.current, menuRef.current],
        { visibility: "visible", opacity: 1 }
      );
      return;
    }

    if (titleRef.current && searchRef.current && mainRef.current) {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(mainRef.current, { opacity: 0 });
        gsap.set(titleRef.current, { x: 600, y: 370, scale: 3.5, opacity: 1 });
        gsap.set(searchRef.current, { opacity: 0 });
        gsap.set(menuRef.current, { x: -80, opacity: 0 });

        const intro = gsap.timeline();
        intro
          .to(mainRef.current, { opacity: 1, duration: 0.5, ease: "power2.out" })
          .to(titleRef.current, {
            x: 10,
            y: 0,
            scale: 1.5,
            duration: 1.6,
            ease: "power4.inOut",
          })
          .to(searchRef.current, { opacity: 1, duration: 0.7 }, "-=0.5")
          .to(menuRef.current, { x: 0, opacity: 1, duration: 0.7 }, "<");

        return () => intro.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.set([mainRef.current, titleRef.current, searchRef.current, menuRef.current], {
          clearProps: "all",
        });
      });

      hasAnimatedRef.current = true;
      return () => mm.revert();
    }
  }, [pathname]);

  const authPathname = ["/login", "/register"];
  const userName = user?.user_metadata?.name || user?.email || "";

  return (
    <div
      className={pathname === "/" ? "header-container-absolute" : "header-container-flex"}
      ref={mainRef}
    >
      <div className="header-wrapper">
        <div className="header-logo opacity-0" ref={titleRef}>
          <Link href="/">
            <h1>Estee Gold Studio</h1>
          </Link>
        </div>

        {!authPathname.includes(pathname) && (
          <div className="header-icons opacity-0" ref={searchRef}>
            <div className="search-section">
              <input
                type="search"
                placeholder="Search"
                aria-label="Search products"
                className="outline-none text-sm bg-transparent placeholder:text-gray-900"
              />
              <Search className="text-gray-900" />
            </div>

            <Link href="/cart" aria-label="Shopping bag">
              <LucideShoppingBag className="text-gray-900 cursor-pointer text-lg mx-2" />
            </Link>

            <Link href={user ? "/dashboard" : "/login"} aria-label={user ? "Account" : "Login"}>
              <p className="text-lg cursor-pointer">
                {userName ? `Welcome, ${userName}` : <User />}
              </p>
            </Link>
          </div>
        )}
      </div>

      <div className="header-menu">
        <Menu ref={menuRef} />
      </div>
    </div>
  );
}

export default Header;
