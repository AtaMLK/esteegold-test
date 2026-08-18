"use client";

import "@/styles/styles.css";
import gsap from "gsap";
import { LucideShoppingBag, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Menu from "./Menu";
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
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  useEffect(() => {
    if (pathname !== "/" || hasAnimatedRef.current) {
      window.scroll(0, 0);
      gsap.set(
        [mainRef.current, titleRef.current, searchRef.current, menuRef.current],
        { visibility: "visible", opacity: 1 }
      );
      return;
    }

    if (titleRef.current && searchRef.current && mainRef.current) {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isDesktop, isTablet, isMobile } = context.conditions;

          gsap.set(mainRef.current, { opacity: 0 });
          gsap.set(titleRef.current, {
            x: isDesktop ? 600 : isTablet ? 300 : 0,
            y: isDesktop ? 370 : isTablet ? 320 : 0,
            scale: isDesktop ? 3.5 : isTablet ? 2.5 : 1,
            opacity: 1,
          });
          gsap.set(searchRef.current, { opacity: 0 });
          gsap.set(menuRef.current, { x: -270, y: 250, opacity: 0 });

          gsap.to(mainRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(titleRef.current, {
                x: isDesktop ? 10 : isTablet ? 5 : 0,
                y: 0,
                scale: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
                opacity: 1,
                duration: isMobile ? 0 : 2,
                ease: "power4.inOut",
              });

              gsap.to(searchRef.current, {
                opacity: 1,
                duration: 1,
                ease: "power4.inOut",
                delay: 1,
              });

              gsap.to(menuRef.current, {
                x: 0,
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power4.inOut",
                delay: 1,
              });
            },
          });

          hasAnimatedRef.current = true;
        }
      );

      return () => mm.revert();
    }
  }, [pathname]);

  const authPathname = ["/login", "/register"];
  const userName = user?.user_metadata?.name || user?.email || "";

  return (
    <div
      className={
        pathname === "/"
          ? "header-container-absolute"
          : "header-container-flex"
      }
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
                type="text"
                placeholder="Search"
                className="outline-none text-sm bg-transparent placeholder:text-gray-900"
              />
              <Search className="text-gray-900" />
            </div>

            <Link href="/cart">
              <LucideShoppingBag className="text-gray-900 cursor-pointer text-lg mx-2" />
            </Link>

            <Link href={user ? "/dashboard" : "/login"}>
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
