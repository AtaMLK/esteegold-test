import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ admin: false }, { status: 401 });
    const { data: { user }, error } = await adminClient().auth.getUser(token);
    if (error || !user?.email) return NextResponse.json({ admin: false }, { status: 401 });
    const allowed = (process.env.ADMIN_EMAILS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
    if (!allowed.includes(user.email.toLowerCase())) return NextResponse.json({ admin: false }, { status: 403 });
    return NextResponse.json({ admin: true, email: user.email });
  } catch (error) {
    return NextResponse.json({ admin: false, error: error.message || "Admin check failed." }, { status: 500 });
  }
}
