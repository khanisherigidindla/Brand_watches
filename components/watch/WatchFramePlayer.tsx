"use client";

import React, { PointerEvent, useEffect, useState } from "react";
import { WATCH_FRAME_FILES } from "@/lib/data/realWatches";

export const WatchFramePlayer: React.FC<{ large?: boolean }> = ({ large }) => {
  const total = WATCH_FRAME_FILES.length;
  const [frame, setFrame] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = window.setInterval(() => setFrame((f) => (f % total) + 1), 95);
    return () => window.clearInterval(t);
  }, [total]);

  const handleMouseMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: Math.max(-8, Math.min(8, x * 16)),
      y: Math.max(-8, Math.min(8, y * -14)),
    });
  };

  return (
    <div
      className={`watch-film-frame bg-white rounded-[2rem] border border-slate-200 shadow-[0_40px_90px_-30px_rgba(15,35,60,0.45)] overflow-hidden relative ${
        large ? "w-full max-w-[95vw] h-[80vh] mx-auto" : "w-full max-w-xl mx-auto"
      }`}
      onMouseMove={handleMouseMove}
    >
      {/* Butterfly dot animation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(185,151,91,0.08),transparent_60%)]" />
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-[#b9975b]/50 animate-butterfly-dot"
            style={{
              left: `${(i * 6.7 + 3) % 100}%`,
              top: `${(i * 11.3 + 8) % 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${7 + (i % 6) * 2}s`,
              animationTimingFunction: "ease-in-out",
            }}
          />
        ))}
      </div>

      <div
        className="relative w-full bg-white"
        style={{ aspectRatio: "4 / 3" }}
      >
        <div className="watch-gold-sheen" />
        <div className="watch-flight-shadow" />
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-[1400ms] ease-in-out"
          style={{ perspective: "1200px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={WATCH_FRAME_FILES[frame - 1]}
            alt={`Aura showcase frame ${frame}`}
            className="watch-film-image h-[82%] w-auto drop-shadow-[0_30px_60px_rgba(15,35,60,0.35)]"
            style={{
              transform: `rotateX(${8 + tilt.y}deg) rotateY(${-8 + tilt.x}deg) translateZ(0)`,
            }}
            draggable={false}
          />
        </div>

        {/* Top accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#b9975b] to-transparent" />
      </div>
    </div>
  );
};
