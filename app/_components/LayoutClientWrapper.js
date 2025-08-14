"use client";

import { usePathname } from "next/navigation";
/* import Header from "./ui/Header";
 */ import Footer from "./ui/footer";
import Header from "./ui/header";

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Header />}
      <div>{children}</div>
      {!isAdminPage && <Footer />}
    </>
  );
}
