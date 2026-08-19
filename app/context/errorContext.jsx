"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";

const ErrorContext = createContext(null);

function normalizeError(error, fallback = "Something went wrong.") {
  if (typeof error === "string" && error.trim()) return error.trim();
  if (error?.message && typeof error.message === "string") return error.message;
  return fallback;
}

export function ErrorProvider({ children }) {
  const reportError = useCallback((error, fallback) => {
    const message = normalizeError(error, fallback);
    toast({ variant: "destructive", title: "Something went wrong", description: message });
    return message;
  }, []);

  useEffect(() => {
    const onUnhandledRejection = (event) => reportError(event.reason, "An unexpected request failed.");
    const onError = (event) => {
      // Resource errors such as a missing image are handled by the component
      // that owns the resource. Only report actual JS exceptions globally.
      if (event.error) reportError(event.error, "An unexpected error occurred.");
    };
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
    };
  }, [reportError]);

  const value = useMemo(() => ({ reportError, normalizeError }), [reportError]);
  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
}

export function useError() {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useError must be used inside ErrorProvider.");
  return context;
}
