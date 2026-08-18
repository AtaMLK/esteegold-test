"use client";

import { supabase } from "@/app/_lib/supabase";

export default function Signin() {
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  return <button type="button" onClick={handleSignIn}>Continue with Google</button>;
}
