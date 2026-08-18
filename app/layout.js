import { Toaster } from "@/components/ui/toaster";
import Footer from "./_components/ui/footer";
import Header from "./_components/ui/header";
import { CartProvider } from "./context/cartContext";
import { UserProvider } from "./context/userContext";
import "./globals.css";
import "../styles/fonts.css";

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
            <Header />
            <main>{children}</main>
            <Toaster />
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
