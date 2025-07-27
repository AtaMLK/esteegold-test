"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/app/_lib/useSidebarStore";
import { useAuthStore } from "@/app/_lib/authStore";
import { motion, AnimatePresence } from "framer-motion";

import {
  ShoppingCart,
  Package,
  Settings,
  Users,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const navItems = [
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/setting", icon: Settings, label: "Settings" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

export default function SideBar() {
  const sideBarIsOpen = useSidebarStore((state) => state.sideBarIsOpen);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();

  return (
    <div
      className={`transition-all duration-300 ease-in-out bg-[#0e1f1b] text-white h-screen px-3 py-6 flex flex-col
      ${sideBarIsOpen ? "w-[240px]" : "w-[64px]"}`}
    >
      {/* Top Logo / Title */}
      <div className="flex items-center gap-3 mb-12 px-2">
        <LayoutDashboard className="w-7 h-7 text-lightgreen-400" />
        {sideBarIsOpen && (
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-semibold text-lightgreen-400"
          >
            Admin Dashboard
          </motion.h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link key={href} href={href} className="relative">
              <div
                className={`
                  flex items-center gap-4 px-4 py-2 rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-lightgreen-400 text-black font-semibold"
                      : "hover:bg-white/10"
                  }
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {sideBarIsOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-[15px] whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated highlight bar */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="highlight"
                    className="absolute left-0 top-0 h-full w-[4px] bg-yellow-400 rounded-r-lg"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    exit={{ scaleY: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-4 mt-10 px-4 py-2 text-red-300 hover:text-red-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {sideBarIsOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-[15px]"
            >
              Logout
            </motion.span>
          )}
        </button>
      </nav>
    </div>
  );
}
