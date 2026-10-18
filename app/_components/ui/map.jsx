"use client";

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function StudioMap({ lat = 41.0082, lng = 28.9784, zoom = 10.5 }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let map;
    let observer;
    let disposed = false;
    let loaded = false;
    const timeout = setTimeout(() => { if (!disposed && !loaded) setStatus("unavailable"); }, 20000);
    try {
      setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString());
      map = new MapLibreMap({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [lng, lat], zoom,
        attributionControl: { compact: false },
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
      });
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.once("load", () => { loaded = true; clearTimeout(timeout); if (!disposed) setStatus("ready"); });
      map.on("error", () => { if (!disposed && !loaded) setStatus("unavailable"); });
      observer = new ResizeObserver(() => map.resize());
      observer.observe(containerRef.current);
    } catch {
      clearTimeout(timeout);
      setStatus("unavailable");
    }
    return () => { disposed = true; clearTimeout(timeout); observer?.disconnect(); map?.remove(); };
  }, [lat, lng, zoom]);

  return (
    <div className="contact-map-frame" role="region" aria-label="Interactive Istanbul city map" data-map-status={status}>
      <div ref={containerRef} className="contact-map-canvas" />
      {status !== "ready" && <div className="contact-map-status" role="status"><p>{status === "loading" ? "Opening a window onto Istanbul…" : "The interactive map is unavailable in this browser or connection."}</p><a href="https://www.openstreetmap.org/#map=11/41.0082/28.9784" target="_blank" rel="noreferrer">Open Istanbul in OpenStreetMap ↗</a></div>}
    </div>
  );
}
