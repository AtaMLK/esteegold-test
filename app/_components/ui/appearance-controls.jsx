"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useAppearance } from "../../context/appearanceContext";
import { hasTranslation, localizedHref, unlocalizedPath } from "../../_lib/localization";

export default function AppearanceControls() {
  const { locale, theme, changeTheme, translateText } = useAppearance();
  const pathname = usePathname();
  const targetLocale = locale === "en" ? "tr" : "en";
  const translated = hasTranslation(pathname);
  const destination = localizedHref(translated ? unlocalizedPath(pathname) : "/", targetLocale);
  const dark = theme === "dark";
  const themeLabel = dark ? translateText("Switch to light mode", "Açık görünüme geç") : translateText("Switch to dark mode", "Koyu görünüme geç");
  function switchLanguage(event) {
    event.preventDefault();
    window.location.assign(destination + (translated ? window.location.search + window.location.hash : ""));
  }
  return <div className="house-preferences"><a href={destination} hrefLang={targetLocale} lang={targetLocale} onClick={switchLanguage} aria-label={targetLocale === "tr" ? translated ? "Türkçe" : "Türkçe ana sayfa" : "English"}>{targetLocale === "tr" ? "TR" : "EN"}</a><button type="button" className="house-theme-toggle" aria-label={themeLabel} aria-pressed={dark} title={themeLabel} onClick={() => changeTheme(dark ? "light" : "dark")}><span className="house-theme-toggle-thumb" aria-hidden="true"/><Sun className="house-theme-sun" size={16} strokeWidth={1.5} aria-hidden="true"/><Moon className="house-theme-moon" size={15} strokeWidth={1.5} aria-hidden="true"/></button></div>;
}
