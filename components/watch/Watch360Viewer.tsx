"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Watch360Viewer — a lightweight 3D turntable for a single watch photo.
 *
 * Achieving a "real 360°" feel without per-angle assets:
 *  - The photo is placed on a card inside a 3D perspective scene.
 *  - The scene auto-rotates smoothly on the Y axis (with a gentle X nod)
 *    so the watch is always subtly "moving" and viewable from every angle.
 *  - Pointer (mouse/touch) drag lets the user spin the watch manually to
 *    inspect any angle; releasing resumes the smooth auto-spin.
 *  - A dynamic glare + drop shadow gives a true 3D, lifted look.
 *
 * Embedded on product detail pages and the budget-friendly hero so shoppers
 * can view the selected watch at every angle by clicking "View" / "Details".
 */
export const Watch360Viewer: React.FC<{
  src: string;
  alt: string;
  className?: string;
  autoRotate?: boolean;
}> = ({ src, alt, className = "", autoRotate = true }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(8);
  const [dragging, setDragging] = useState(false);
  const baseYRef = useRef(0);

  // Smooth continuous auto-spin when not dragging.
  useEffect(() => {
    if (!autoRotate) return;
    let last = performance.now();
    const tick = (ts: number) => {
      const dt = ts - last;
      last = ts;
      if (!dragging) {
        baseYRef.current = (baseYRef.current + (dt * 0.03) % 360) % 360;
        setRotY(baseYRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoRotate, dragging]);

  // Pointer drag handling for manual 360 viewing.
  const onPointerDown = () => setDragging(true);
  const onPointerMove = (e: React.PointerEvent) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 .. 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    baseYRef.current = (x * 180) % 360;
    setRotY(baseYRef.current);
    setRotX(-y * 20);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    baseYRef.current = rotY;
    sceneRef.current?.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={sceneRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className={`relative perspective-[1400px] w-full cursor-grab ${className}`}
    >
      <div
        className="relative mx-auto transition-transform duration-200"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
        }}
      >
        {/* Drop shadow for lift */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: "60%",
            height: "18%",
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 70%)",
            filter: "blur(6px)",
          }}
        />
        {/* Watch card */}
        <div className="relative rounded-2xl bg-white border border-slate-200 shadow-[0_30px_70px_-30px_rgba(15,35,60,0.35)]" style={{ aspectRatio: "4 / 3" }}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain p-6"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          {/* Dynamic glare overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%)",
            }}
          />
        </div>
      </div>
      {!dragging && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-widest text-slate-400">
          Drag to rotate · 360° view
        </div>
      )}
    </div>
  );
};

