"use client";

import { useAppearance } from "../../context/appearanceContext";

import { Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function ProductVideo({ src, title = "Product", preview = false, className = "" }) {
  const { translateText } = useAppearance();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  async function toggle(event) {
    event.preventDefault(); event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) { video.pause(); return; }
    setStarted(true);
    try { await video.play(); } catch { toast({ title: translateText("Video unavailable"), description: translateText("Please try again or open another view.") }); }
  }
  return <div className={`product-video ${className} ${preview ? "is-preview" : ""}`} onClick={(event) => { if (preview) event.preventDefault(); event.stopPropagation(); }}>
    <video ref={videoRef} src={src} controls={!preview} playsInline preload="none" aria-label={`${title} video`} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} className={preview && !started ? "invisible" : ""}/>
    <button type="button" aria-label={`${playing ? translateText("Pause") : translateText("Play")} ${title} video`} onClick={toggle}>{playing ? <Pause size={15}/> : <Play size={15}/>}<span>{playing ? translateText("Pause") : translateText("Play film")}</span></button>
  </div>;
}
