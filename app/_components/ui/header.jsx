"use client";

import { useHeaderStore } from "@/app/_lib/headerStore";
import { supabase } from "@/app/_lib/supabaseClient";
import "@/styles/styles.css";
import { motion, useAnimation } from "framer-motion";
import { LucideShoppingBag, Search, User } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Menu from "./Menu";

function Header() {
  const setHeaderLoaded = useHeaderStore((state) => state.setHeaderLoaded);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const pathname = usePathname();
  const mainControls = useAnimation();
  const titleControls = useAnimation();
  const searchControls = useAnimation();
  const menuControls = useAnimation();

  useEffect(() => {
    const runAnimations = async () => {
      await mainControls.start({
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });
    };

    runAnimations();
  }, []);

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
      if (pathname !== "/") {
        await Promise.all([
          mainControls.set({ opacity: 1 }),
          titleControls.set({ x: 0, y: 0, scale: 1, opacity: 1 }),
          searchControls.set({ opacity: 1 }),
          menuControls.set({ x: 0, y: 0, opacity: 1 }),
        ]);
        setHeaderLoaded(true);
        return;
      }

      const width = window.innerWidth;
      const isDesktop = width >= 1024;
      const isTablet = width >= 768 && width < 1024;
      const isMobile = width < 768;

      await Promise.all([
        mainControls.set({ opacity: 0 }),
        titleControls.set({
          x: isDesktop ? 600 : isTablet ? 300 : 0,
          y: isDesktop ? 370 : isTablet ? 320 : 0,
          scale: isDesktop ? 3.5 : isTablet ? 2.5 : 1,
          opacity: 1,
        }),
        searchControls.set({ opacity: 0 }),
        menuControls.set({ x: -270, y: 250, opacity: 0 }),
      ]);

      await mainControls.start({
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });

      await titleControls.start({
        x: isDesktop ? 600 : isTablet ? 300 : 0,
        y: 0,
        scale: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
        opacity: 1,
        transition: { duration: isMobile ? 0 : 2, ease: "easeInOut" },
      });

      await titleControls.start({
        x: 10,
        y: 0,
        scale: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
        opacity: 1,
        transition: { duration: isMobile ? 0 : 2, ease: "easeInOut" },
      });

      await Promise.all([
        searchControls.start({
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut", delay: 1 },
        }),
        menuControls.start({
          x: 0,
          y: 0,
          opacity: 1,
          transition: { duration: 1, ease: "easeInOut", delay: 1 },
        }),
      ]);

      setHeaderLoaded(true);
    }
    runAnimations();
  }, [pathname]);

  // Fallback timeout for headerLoaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeaderLoaded(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [setHeaderLoaded]);

  // Determine if current path is an auth page
  const isAuthPage =
    authPathname.includes(pathname) || pathname.startsWith("/admin");

  return (
    <motion.div
      className={`${
        pathname === "/" ? "header-container-absolute" : "header-container-flex"
      }`}
      animate={mainControls}
      initial={{ opacity: 0 }}
    >
      <div className="header-wrapper">
        <motion.div
          className="header-logo"
          animate={titleControls}
          initial={false}
        >
          <Link href="/">
            <h1>Estee Gold Studio</h1>
          </Link>
        </motion.div>

        {!isAuthPage && (
          <motion.div
            className="header-icons"
            animate={searchControls}
            initial={{ opacity: 0 }}
          >
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

            {isLoggedIn ? (
              <Link href="/dashboard">
                <p className="text-lg cursor-pointer">Welcome, {userName}</p>
              </Link>
            ) : (
              <Link href="/login">
                <User className="text-lg cursor-pointer" />
              </Link>
            )}
          </motion.div>
        )}
      </div>

      <motion.div
        className="header-menu"
        animate={menuControls}
        initial={{ x: -270, y: 250, opacity: 0 }}
      >
        <Menu ref={null} />
      </motion.div>
    </motion.div>
  );
}

export default Header;
