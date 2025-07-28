import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function middleware(req) {
  const token = req.cookies.get("sb-access-token")?.value;

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isUserPath = req.nextUrl.pathname.startsWith("/dashboard");

  if (!token && (isAdminPath || isUserPath)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isAdminPath) {
    try {
      const decoded = jwtDecode(token);
      const email = decoded?.email;

      const adminEmails = ["setareh@gmail.com", "admin@admin.com"];
      if (!adminEmails.includes(email)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("JWT decode error:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// protected routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
