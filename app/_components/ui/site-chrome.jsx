"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const privateRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/auth" || pathname.startsWith("/auth/");
  if (privateRoute) return <>{children}</>;
  return <><a href="#main-content" className="house-skip-link">Skip to content</a><Header /><div id="main-content" tabIndex={-1}>{children}</div><Footer /></>;
}
