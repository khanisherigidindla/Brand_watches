"use client";

import React, { useState, useEffect } from "react";

const FRAMES = [
  "/watch-frames/ezgif-frame-005.jpg",
  "/watch-frames/ezgif-frame-015.jpg",
  "/watch-frames/ezgif-frame-025.jpg",
  "/watch-frames/ezgif-frame-035.jpg",
  "/watch-frames/ezgif-frame-045.jpg",
];

export const AuthWatchStage: React.FC = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % FRAMES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center bg-slate-50"
      style={{ minHeight: "420px", height: "100%" }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: "100%", height: "100%", minHeight: "360px" }}
      >
        {FRAMES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Watch ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        ))}
        {FRAMES.length === 0 && (
          <div className="w-40 h-40 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-slate-400 text-sm">Watch image</span>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-6 text-center">Timeless craftsmanship</p>
    </div>
  );
};

