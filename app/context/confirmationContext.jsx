"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ConfirmationContext = createContext(null);

export function ConfirmationProvider({ children }) {
  const [request, setRequest] = useState(null);
  const dialogRef = useRef(null);
  const resolveRef = useRef(null);
  const finish = useCallback((accepted) => {
    resolveRef.current?.(accepted);
    resolveRef.current = null;
    dialogRef.current?.close();
    setRequest(null);
  }, []);
  const confirm = useCallback((options) => {
    if (resolveRef.current) return Promise.resolve(false);
    return new Promise((resolve) => { resolveRef.current = resolve; setRequest(options); });
  }, []);
  useEffect(() => {
    if (request) { dialogRef.current.showModal(); dialogRef.current.querySelector("[data-cancel]")?.focus(); }
  }, [request]);
  useEffect(() => () => resolveRef.current?.(false), []);
  return <ConfirmationContext.Provider value={confirm}>{children}<dialog ref={dialogRef} className="house-confirmation" aria-labelledby="confirmation-title" aria-describedby="confirmation-description" onCancel={(event) => { event.preventDefault(); finish(false); }} onClose={() => { if (resolveRef.current) finish(false); }}><p className="house-confirmation-eyebrow">EsteeHouse / Please confirm</p><h2 id="confirmation-title">{request?.title || "Are you sure?"}</h2><p id="confirmation-description">{request?.description}</p><div className="house-confirmation-actions"><button type="button" data-cancel onClick={() => finish(false)}>Keep it</button><button type="button" data-destructive onClick={() => finish(true)}>{request?.action || "Remove"}</button></div></dialog></ConfirmationContext.Provider>;
}

export function useConfirmation() {
  const confirm = useContext(ConfirmationContext);
  if (!confirm) throw new Error("useConfirmation requires ConfirmationProvider");
  return confirm;
}
