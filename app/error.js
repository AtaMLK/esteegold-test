"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useError } from "./context/errorContext";

export default function AppError({ error, reset }) {
  const { reportError } = useError();

  useEffect(() => {
    reportError(error, "This page could not be loaded. Please try again.");
  }, [error, reportError]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-[var(--paper)] px-6 text-center">
      <div className="max-w-xl">
        <p className="text-[9px] uppercase tracking-[.3em] text-black/40">EsteeHouse / Error</p>
        <h1 className="mt-5 font-serif text-5xl tracking-[-.05em]">Something went wrong.</h1>
        <p className="mt-4 text-sm leading-6 text-black/45">{error?.message || "The page could not be loaded."}</p>
        <button onClick={() => reset()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[9px] uppercase tracking-[.2em] text-white">
          <RefreshCw size={13} /> Try again
        </button>
      </div>
    </main>
  );
}
