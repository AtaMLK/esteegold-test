import StructuredData from "./_components/ui/structured-data";
import { headers } from "next/headers";
import { AppearanceProvider } from "./context/appearanceContext";
import { pageMetadata, siteSchema, siteUrl } from "./_lib/seo";
import { Toaster } from "@/components/ui/toaster";
import SiteChrome from "./_components/ui/site-chrome";
import { CartProvider } from "./context/cartContext";
import { UserProvider } from "./context/userContext";
import { WishlistProvider } from "./context/wishlistContext";
import { ErrorProvider } from "./context/errorContext";
import { ConfirmationProvider } from "./context/confirmationContext";
import "./globals.css";
import "../styles/fonts.css";
import "../styles/styles.css";
import "./_components/ui/chrome-overrides.css";
import "./_components/ui/appearance.css";

export const metadata = {
  ...pageMetadata({ title: "EsteeHouse — Handmade Bags & Silver from Türkiye" }),
  metadataBase: new URL(siteUrl()),
  applicationName: "EsteeHouse",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export default async function RootLayout({ children }) {
  const locale = (await headers()).get("x-estee-locale") === "tr" ? "tr" : "en";
  return (
    <html lang={locale} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('esteehouse-theme')==='dark'?'dark':'light'}catch{}})()` }}/></head>
      <body className="house-site">
        <StructuredData data={siteSchema()}/>
        <AppearanceProvider initialLocale={locale}><ConfirmationProvider><ErrorProvider>
          <UserProvider>
            <WishlistProvider>
              <CartProvider>
                <SiteChrome>{children}</SiteChrome>
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </ErrorProvider></ConfirmationProvider></AppearanceProvider>
      </body>
    </html>
  );
}
