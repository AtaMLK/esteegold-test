import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAdminUser } from "./app/_lib/server-supabase";

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL, process.env.NEXT_PUBLIC_SUPABASE_API_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!isAdminUser(user)) {
      const destination = user ? "/profile?access=admin_denied" : "/auth/login?next=%2Fadmin";
      const redirect = NextResponse.redirect(new URL(destination, request.url));
      response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
      return redirect;
    }
  }
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
