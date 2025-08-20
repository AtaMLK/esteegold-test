"use client";

import { useHeaderStore } from "@/app/_lib/headerStore";
import { supabase } from "@/app/_lib/supabaseClient";
import "@/styles/styles.css";
import { LucideShoppingBag, User, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Menu from "./Menu";
import gsap from "gsap";

function Header() {
  const setHeaderLoaded = useHeaderStore((state) => state.setHeaderLoaded);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const pathname = usePathname();

  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const menuRef = useRef(null);

  const searchModalRef = useRef(null);
  const searchInputRef = useRef(null);

  const authPathname = ["/login", "/register", "/admin"];

  // Listen to auth state changes
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserName(session.user.user_metadata?.name || "");
        setIsLoggedIn(true);
      } else {
        setUserName("");
        setIsLoggedIn(false);
      }
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUserName(session.user.user_metadata?.name || "");
          setIsLoggedIn(true);
        } else {
          setUserName("");
          setIsLoggedIn(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Animate header on pathname changes
  useEffect(() => {
    async function runAnimations() {
      if (!headerRef.current || !titleRef.current || !menuRef.current) return;

      if (pathname !== "/") {
        gsap.set(headerRef.current, { opacity: 1 });
        gsap.set(titleRef.current, { x: 0, y: 0, scale: 1, opacity: 1 });
        gsap.set(menuRef.current, { x: 0, y: 0, opacity: 1 });
        setHeaderLoaded(true);
        return;
      }

      const width = window.innerWidth;
      const isDesktop = width >= 1024;
      const isTablet = width >= 768 && width < 1024;
      const isMobile = width < 768;

      // حالت اولیه
      gsap.set(headerRef.current, { opacity: 0 });
      gsap.set(titleRef.current, {
        x: isDesktop ? 600 : isTablet ? 300 : 0,
        y: isDesktop ? 370 : isTablet ? 320 : 0,
        scale: isDesktop ? 3.5 : isTablet ? 2.5 : 1,
        opacity: 1,
      });
      gsap.set(menuRef.current, { x: -270, y: 250, opacity: 0 });

      // انیمیشن‌ها
      const tl = gsap.timeline();
      tl.to(headerRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      })
        .to(titleRef.current, {
          x: 10,
          y: 0,
          scale: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
          opacity: 1,
          duration: isMobile ? 0 : 2,
          ease: "power2.inOut",
        })
        .to(menuRef.current, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power2.inOut",
        });

      setHeaderLoaded(true);
    }
    runAnimations();
  }, [pathname]);

  // Fallback timeout for headerLoaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [setHeaderLoaded]);

  // Animate search modal with GSAP
  useEffect(() => {
    if (searchOpen && searchModalRef.current && searchInputRef.current) {
      const tl = gsap.timeline();

      // animate modal background fade in
      tl.fromTo(
        searchModalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      // animate input drop from top
      tl.fromTo(
        searchInputRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [searchOpen]);

  const isAuthPage =
    authPathname.includes(pathname) || pathname.startsWith("/admin");

  return (
    <div
      ref={headerRef}
      className={`${
        pathname === "/" ? "header-container-absolute" : "header-container-flex"
      }`}
    >
      <div className="header-wrapper">
        <div className="header-logo-placeholder w-[150px] h-[40px] flex items-center">
          {/* ref={titleRef}> */}
        </div>

        {!isAuthPage && (
          <div className="header-icons flex items-center space-x-4">
            {/* Search Icon */}
            <div className="cursor-pointer" onClick={() => setSearchOpen(true)}>
              <Search className="text-gray-900 text-lg" />
            </div>

            {/* Cart */}
            <Link href="/cart">
              <LucideShoppingBag className="text-gray-900 cursor-pointer text-lg" />
            </Link>

            {/* User Info */}
            {isLoggedIn ? (
              <Link href="/dashboard">
                <p className="text-lg cursor-pointer">Welcome, {userName}</p>
              </Link>
            ) : (
              <Link href="/login">
                <User className="text-lg cursor-pointer" />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Menu */}
      <div
        className="header-menu"
        /* ref={menuRef}
        style={{ opacity: 0, transform: "translate(-270px,250px)" }} */
      >
        <Menu ref={null} />
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div
          ref={searchModalRef}
          className="fixed inset-0 bg-white/90 z-50 flex flex-col items-center justify-center"
          onClick={() => setSearchOpen(false)} // close modal on background click
        >
          <div
            className=" p-6 w-[50%] flex justify-center items-center"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking input
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="w-full outline-none border-b border-gray-900 text-gray-900 text-lg bg-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
