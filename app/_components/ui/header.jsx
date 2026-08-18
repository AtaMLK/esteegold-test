"use client";

import "@/styles/styles.css";
import { LucideShoppingBag, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Menu from "./menu";
import { useAuthStore } from "@/app/_lib/authStore";
import { supabase } from "@/app/_lib/supabase";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, [fetchUser]);

  const authPathname = ["/login", "/register"];
  const userName = user?.user_metadata?.name || user?.email || "";

  return (
    <header className={pathname === "/" ? "header-container-absolute" : "header-container-flex"}>
      <div className="header-wrapper">
        <div className="header-logo"><Link href="/" aria-label="Estee Gold Studio home">Estee Gold Studio</Link></div>
        {!authPathname.includes(pathname) && (
          <div className="header-icons">
            <div className="search-section"><input type="search" placeholder="Search" aria-label="Search products" className="outline-none text-sm bg-transparent placeholder:text-gray-900" /><Search className="text-gray-900" size={18} /></div>
            <Link href="/cart" aria-label="Shopping bag"><LucideShoppingBag className="text-gray-900 cursor-pointer mx-2" size={19} /></Link>
            <Link href={user ? "/dashboard" : "/login"} aria-label={user ? "Account" : "Login"}><span className="header-user">{userName ? `Welcome, ${userName}` : <User size={19} />}</span></Link>
          </div>
        )}
      </div>
      <div className="header-menu"><Menu /></div>
    </header>
  );
}
