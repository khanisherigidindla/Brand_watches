"use client";

import React from "react";
import { useAudioStore } from "@/lib/store/audioStore";

interface LuxuryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const LuxuryButton: React.FC<LuxuryButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className = "",
  onClick,
  ...props
}) => {
  const playTick = useAudioStore((s) => s.playTick);

  const baseStyles =
    "relative inline-flex items-center justify-center font-sans tracking-ultra-wide uppercase font-medium transition-all duration-500 overflow-hidden group select-none disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "text-xs px-4 py-2.5 space-x-2",
    md: "text-xs px-7 py-3.5 space-x-3",
    lg: "text-sm px-9 py-4 space-x-3.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-obsidian-800 to-obsidian-900 text-white border border-white/15 hover:border-gold/60 hover:shadow-gold-glow",
    gold:
      "bg-gradient-to-r from-gold via-gold-champagne to-gold-dark text-obsidian-950 font-semibold border border-gold hover:shadow-gold-glow-lg hover:brightness-110",
    secondary:
      "bg-obsidian-700/80 text-silver-light border border-white/10 hover:bg-obsidian-600 hover:text-white",
    outline:
      "bg-transparent text-silver-light border border-white/20 hover:border-gold hover:text-gold hover:shadow-gold-glow",
    ghost:
      "bg-transparent text-silver hover:text-gold hover:bg-white/5",
  }[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playTick();
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {/* Subtle metallic shine sweep animation on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      {icon && <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
