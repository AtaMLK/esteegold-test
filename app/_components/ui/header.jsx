"use client";

import { useAuthStore } from "@/app/_lib/authStore";
import { supabase } from "@/app/_lib/supabase";
import "@/styles/styles.css";
import { motion, useAnimation } from "framer-motion";
import { LucideShoppingBag, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Menu from "./Menu";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const user = useAuthStore();
  const pathname = usePathname();

  const mainControls = useAnimation();
  const titleControls = useAnimation();
  const searchControls = useAnimation();
  const menuControls = useAnimation();

  const authPathname = ["/login", "/register", "admin/*"];

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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

  useEffect(() => {
    async function runAnimations() {
      if (pathname !== "/") {
        // اگر صفحه اصلی نیست، همه ویژوال‌ها رو بلافاصله نشون بده
        await Promise.all([
          mainControls.set({ opacity: 1 }),
          titleControls.set({ x: 0, y: 0, scale: 1, opacity: 1 }),
          searchControls.set({ opacity: 1 }),
          menuControls.set({ x: 0, y: 0, opacity: 1 }),
        ]);
        return;
      }

      // صفحه اصلی: انیمیشن مرحله‌ای

      const width = window.innerWidth;
      const isDesktop = width >= 1024;
      const isTablet = width >= 768 && width < 1024;
      const isMobile = width < 768;

      // شروع: حالت مخفی و خارج از صفحه با مقیاس بزرگ
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

      // نمایش کل container
      await mainControls.start({
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
      });

      // حرکت لوگو به موقعیت نهایی و کاهش مقیاس
      await titleControls.start({
        x: isDesktop ? 10 : isTablet ? 5 : 0,
        y: 0,
        scale: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
        opacity: 1,
        transition: { duration: isMobile ? 0 : 2, ease: "easeInOut" },
      });

      // نمایش سرچ و منو به صورت همزمان بعد از لوگو
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
    }

    runAnimations();
  }, [pathname, mainControls, titleControls, searchControls, menuControls]);

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

        {authPathname.includes(pathname) ? null : (
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
