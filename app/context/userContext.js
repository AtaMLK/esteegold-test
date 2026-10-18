"use client";

import { useAppearance } from "./appearanceContext";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../_lib/supabase";
import { toast } from "@/hooks/use-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { translateText, href } = useAppearance();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const revision = useRef(0);
  const logoutPending = useRef(false);

  useEffect(() => {
    let mounted = true;
    const currentRevision = revision.current;
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (mounted && currentRevision === revision.current) setUser(error ? null : data.user);
      } catch { if (mounted && currentRevision === revision.current) setUser(null); }
      finally { if (mounted) setAuthLoading(false); }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        revision.current += 1;
        setUser(session?.user || null);
        setAuthLoading(false);
      }
    );

    getUser();

    return () => { mounted = false; authListener.subscription.unsubscribe(); };
  }, []);

  const logout = async () => {
    if (logoutPending.current) return;
    logoutPending.current = true;
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      revision.current += 1;
      setUser(null);
      window.location.replace(href("/"));
    } catch (error) {
      toast({ variant: "destructive", title: translateText("Could not sign out"), description: error.message || translateText("Please try again.") });
      logoutPending.current = false;
      setSigningOut(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, logout, authLoading, signingOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
