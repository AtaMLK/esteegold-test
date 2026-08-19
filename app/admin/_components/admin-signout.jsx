"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../_lib/supabase";
import { useError } from "../../context/errorContext";

export default function AdminSignOut() {
  const router = useRouter();
  const { reportError } = useError();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);

    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;
      router.replace("/auth/login?next=/admin");
      router.refresh();
    } catch (error) {
      reportError(error, "Could not sign out. Please try again.");
      setSigningOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={signingOut}
      className="flex items-center gap-2 border-t border-black/10 pt-5 text-left text-[8px] uppercase tracking-[.2em] text-black/40 transition hover:text-black disabled:opacity-40"
    >
      <LogOut size={13} />
      {signingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
