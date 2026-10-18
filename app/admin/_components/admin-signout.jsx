"use client";

import { LogOut } from "lucide-react";
import { useUser } from "../../context/userContext";

export default function AdminSignOut() {
  const { logout, signingOut } = useUser();
  return <button type="button" onClick={logout} disabled={signingOut} className="flex items-center gap-2 border-t border-black/10 pt-5 text-left text-[8px] uppercase tracking-[.2em] text-black/40 transition hover:text-black disabled:opacity-40"><LogOut size={13}/>{signingOut ? "Signing out…" : "Sign out"}</button>;
}
