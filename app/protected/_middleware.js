import { NextResponse } from "next/server";

export function middleWare(req) {
  const token = req.cookies.get("auth-token")?.value;
  if (!token) return NextResponse.redirect("/login");
  return NextResponse.next();
}
