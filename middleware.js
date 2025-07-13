import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("sb-access-token")?.value;

  const isAdminPath = req.nextUrl.pathname.startWith("/admin");

  if (isAdminPath) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const adminEmails = ["setareh@gmail.com", "admin@admin.com"];
    if (!adminEmails.includes(user.email)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};