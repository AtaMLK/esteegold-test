"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath, localizedHref, translate } from "../_lib/localization";
import { turkishUI } from "../_lib/ui-translations";

const AppearanceContext = createContext(null);

export function AppearanceProvider({ children, initialLocale = "en" }) {
  const pathname = usePathname();
  const locale = pathname ? localeFromPath(pathname) : initialLocale;
  const [theme, setTheme] = useState("light");
  const href = useCallback((path) => localizedHref(path, locale), [locale]);
  const translateText = useCallback((english, turkish = turkishUI[english] || english) => translate(locale, english, turkish), [locale]);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => {
    function apply() {
      let preference = "light";
      try { preference = window.localStorage.getItem("esteehouse-theme") === "dark" ? "dark" : "light"; } catch {}
      setTheme(preference);
      document.documentElement.dataset.theme = preference;
    }
    apply();
    window.addEventListener("storage", apply);
    return () => { window.removeEventListener("storage", apply); };
  }, []);
  function changeTheme(value) {
    if (!["light", "dark"].includes(value)) return;
    try { window.localStorage.setItem("esteehouse-theme", value); } catch {}
    setTheme(value);
    document.documentElement.dataset.theme = value;
  }
  return <AppearanceContext.Provider value={{ locale, theme, changeTheme, href, translateText }}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error("AppearanceProvider is required.");
  return value;
}
