import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL, process.env.NEXT_PUBLIC_SUPABASE_API_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookies) { cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (!user?.email || !allowed.includes(user.email.toLowerCase())) return NextResponse.redirect(new URL("/auth/login?next=/admin", request.url));
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
