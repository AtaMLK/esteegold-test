import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({
    req,
    res,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isUserPath = req.nextUrl.pathname.startsWith("/dashboard");

  // اگر لاگین نیست
  if (!user && (isAdminPath || isUserPath)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // اگر مسیر admin بود ولی ایمیل admin نبود
  if (isAdminPath && user) {
    const adminEmails = ["setareh@gmail.com", "admin@admin.com"];
    if (!adminEmails.includes(user.email)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
