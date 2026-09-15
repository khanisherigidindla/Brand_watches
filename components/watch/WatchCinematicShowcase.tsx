"use client";

import React, { useEffect, useRef, useState } from "react";
import { WATCH_FRAME_FILES } from "@/lib/data/realWatches";

/**
 * WatchCinematicShowcase — single big watch-frames film, no counters/timers.
 */
export const WatchCinematicShowcase: React.FC = () => {
  const total = WATCH_FRAME_FILES.length;
  const [frame, setFrame] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setInterval(() => setFrame((f) => (f % total) + 1), 90);
    return () => window.clearInterval(t);
  }, [total]);

  // Preload every frame once so the turntable film plays with zero flicker.
  useEffect(() => {
    WATCH_FRAME_FILES.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: Math.max(-10, Math.min(10, x * 20)), y: Math.max(-10, Math.min(10, y * -16)) });
  };

  return (
    <div ref={wrapRef} onPointerMove={onMove} className="relative w-full mx-auto">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(185,151,91,0.18),transparent_65%)]" />
      </div>

      <div className="watch-film-frame relative bg-white rounded-[2rem] border border-slate-200 shadow-[0_50px_110px_-30px_rgba(15,35,60,0.5)] overflow-hidden">
        <div className="relative w-full bg-white" style={{ aspectRatio: "16 / 10" }}>
          <div className="watch-gold-sheen" />
          <div className="watch-flight-shadow" />
          <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: "2000px" }}>
            <div className="watch-film-float h-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={WATCH_FRAME_FILES[frame - 1]} alt="Aurelion watch showcase"
                className="watch-film-image h-full w-auto"
                draggable={false}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                style={{ transform: `rotateX(${6 + tilt.y}deg) rotateY(${-6 + tilt.x}deg) scale(1.14)` }} />
            </div>
          </div>

          {/* Single floating gold video — large, properly displayed */}
          <video
            src="/assets/video/Watch_Gold-Video.mp4"
            poster="/watch-frames/ezgif-frame-001.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute z-10 left-1/2 -translate-x-1/2 top-[6%] w-[46%] max-w-[420px] aspect-video object-contain rounded-xl shadow-[0_20px_50px_-12px_rgba(15,35,60,0.45)] border border-slate-200 bg-white"
          />

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#b9975b] to-transparent" />
        </div>
      </div>
    </div>
  );
};
