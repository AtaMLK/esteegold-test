import { Toaster } from "@/components/ui/toaster";
import SiteChrome from "./_components/ui/site-chrome";
import { CartProvider } from "./context/cartContext";
import { UserProvider } from "./context/userContext";
import { WishlistProvider } from "./context/wishlistContext";
import { ErrorProvider } from "./context/errorContext";
import "./globals.css";
import "../styles/fonts.css";
import "../styles/styles.css";
import "./_components/ui/chrome-overrides.css";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://esteegold-test.vercel.app"),
  title: "EsteeHouse — Bags & Silver",
  description: "A creative house for handmade bags and silver. Different materials. Objects with a character of their own.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="house-site">
        <ErrorProvider>
          <UserProvider>
            <WishlistProvider>
              <CartProvider>
                <SiteChrome>{children}</SiteChrome>
                <Toaster />
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
