"use client";

import React, { useEffect, useState } from "react";

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest("button, a, [data-cursor]");

      if (interactiveEl) {
        setIsHovered(true);
        const customAction = interactiveEl.getAttribute("data-cursor");
        setCursorText(customAction || "");
      } else {
        setIsHovered(false);
        setCursorText("");
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let frameId: number;
    const animateTrailing = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.18,
        y: prev.y + (position.y - prev.y) * 0.18,
      }));
      frameId = requestAnimationFrame(animateTrailing);
    };
    frameId = requestAnimationFrame(animateTrailing);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(frameId);
    };
  }, [position.x, position.y, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-50">
      {/* Precision inner center dot */}
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-gold rounded-full transition-transform duration-75 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      />

      {/* Trailing luxury ring */}
      <div
        className={`fixed top-0 left-0 rounded-full border border-gold/40 transition-all duration-300 pointer-events-none flex items-center justify-center ${
          isHovered
            ? "w-16 h-16 bg-gold/10 backdrop-blur-[1px] border-gold"
            : "w-8 h-8 bg-transparent"
        } -translate-x-1/2 -translate-y-1/2`}
        style={{
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0) translate(-50%, -50%)`,
        }}
      >
        {cursorText && (
          <span className="text-[9px] tracking-widest text-gold uppercase font-sans font-semibold">
            {cursorText}
          </span>
        )}
      </div>
    </div>
  );
};
