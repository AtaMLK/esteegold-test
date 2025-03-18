"use client";
import gsap from "gsap";
import { LucideShoppingBag, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import "@/styles/styles.css";
import Menu from "./Menu";

function Header() {
  const menuRef = useRef(null);
  const mainRef = useRef(null);
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const pathname = usePathname();
  const hasAnimatedRef = useRef(false); // Tracks if animation has already played

  useEffect(() => {
    if (pathname !== "/" || hasAnimatedRef.current) {
      window.scroll(0, 0);
      // Ensure all elements are fully visible if not on homepage
      gsap.set(
        [mainRef.current, titleRef.current, searchRef.current, menuRef.current],
        {
          visibility: "visible",
          opacity: 1,
        }
      );
      return;
    }

    if (titleRef.current && searchRef.current && mainRef.current) {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)", // Large screens
          isTablet: "(min-width: 768px) and (max-width: 1023px)", // Tablets
          isMobile: "(max-width: 767px)", // Phones
        },
        (context) => {
          let { isDesktop, isTablet, isMobile } = context.conditions;

          // Initially hide elements
          gsap.set(mainRef.current, { opacity: 0 });
          gsap.set(titleRef.current, {
            x: isDesktop ? "55%" : isTablet ? "50%" : "0",
            y: isDesktop ? 250 : isTablet ? 200 : 0,
            scale: isDesktop ? 3.5 : isTablet ? 2.5 : 1,
            opacity: 0,
          });
          gsap.set(searchRef.current, { opacity: 0 });
          gsap.set(menuRef.current, { x: -270, y: 250, opacity: 0 });

          // Main container fades in first
          gsap.to(mainRef.current, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => {
              // Title animation after mainRef appears
              gsap.to(titleRef.current, {
                x: isDesktop ? 0 : isTablet ? 5 : 10,
                y: 0,
                scale: isDesktop ? 1.5 : isTablet ? 1.2 : 1,
                opacity: 1,
                duration: isMobile ? 0 : 2,
                ease: "power4.inOut",
              });

              // SearchRef appears 1 second after mainRef
              gsap.to(searchRef.current, {
                opacity: 1,
                duration: 1,
                ease: "power4.inOut",
                delay: 1,
              });

              // Menu appears at the same time as searchRef
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

          hasAnimatedRef.current = true; // Marks animation as played
        }
      );

      return () => mm.revert(); // Cleanup GSAP media queries on unmount
    }
  }, [pathname]);

  const authPathname = ["/auth/login", "/auth/register"];

  return (
    <div
      className={`${
        pathname === "/" ? "header-container-absolute" : "header-container-flex"
      }`}
      ref={mainRef}
    >
      {/* Header content (Logo + Search) */}
      <div className="header-wrapper">
        {/* Logo */}
        <div className="header-logo opacity-0" ref={titleRef}>
          <Link href="/">
            <h1>Estee Gold Studio</h1>
          </Link>
        </div>
        {/* Search & Cart Icons */}
        {authPathname.includes(pathname) ? (
          ""
        ) : (
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
            <Link href="/auth/login">
              <User />
            </Link>
          </div>
        )}
      </div>
      {/* Burger Menu */}
      <div className="header-menu">
        <Menu ref={menuRef} />
      </div>
    </div>
  );
}

export default Header;
