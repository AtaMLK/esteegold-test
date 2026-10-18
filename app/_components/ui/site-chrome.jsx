"use client";

import { useAppearance } from "../../context/appearanceContext";
import { unlocalizedPath } from "../../_lib/localization";
import AppearanceControls from "./appearance-controls";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import "./house-pages.css";

export default function SiteChrome({ children }) {
  const { translateText } = useAppearance();
  const pathname = usePathname();
  const path = unlocalizedPath(pathname);
  const privateRoute = path === "/admin" || path.startsWith("/admin/") || path === "/auth" || path.startsWith("/auth/");
  if (privateRoute) return <>{path.startsWith("/auth") && <div className="house-auth-preferences"><AppearanceControls/></div>}{children}</>;
  return <><a href="#main-content" className="house-skip-link">{translateText("Skip to content")}</a><Header /><div id="main-content" className="house-public" tabIndex={-1}>{children}</div><Footer /></>;
}
