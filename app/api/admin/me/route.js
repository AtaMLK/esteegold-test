import { NextResponse } from "next/server";
import { getRequestUser, isAdminUser } from "../../../_lib/server-supabase";

export async function GET(request) {
  try {
    const user = await getRequestUser(request);
    if (!user) return NextResponse.json({ admin: false }, { status: 401 });
    if (!isAdminUser(user)) return NextResponse.json({ admin: false }, { status: 403 });
    return NextResponse.json({ admin: true, email: user.email });
  } catch (error) {
    return NextResponse.json({ admin: false, error: error.message || "Admin check failed." }, { status: error.status || 500 });
  }
}
