import { Toaster } from "@/components/ui/toaster";
import SiteChrome from "./_components/ui/site-chrome";
import { CartProvider } from "./context/cartContext";
import { UserProvider } from "./context/userContext";
import "./globals.css";
import "../styles/fonts.css";
import "../styles/styles.css";

export const metadata = {
  title: "EsteeHouse — EsteeGold & EsteeBags",
  description: "EsteeHouse is a creative house for jewelry, accessories and handmade paracord and knitted bags.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <CartProvider>
            <SiteChrome>{children}</SiteChrome>
            <Toaster />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
