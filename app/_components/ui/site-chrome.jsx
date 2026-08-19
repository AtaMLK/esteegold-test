"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const privateRoute = pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/auth" || pathname.startsWith("/auth/");
  if (privateRoute) return <>{children}</>;
  return <><Header /><main>{children}</main><Footer /></>;
}
