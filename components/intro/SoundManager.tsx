"use client";

import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAudioStore } from "@/lib/store/audioStore";

export const SoundToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { isMuted, toggleMute, playShimmer } = useAudioStore();

  const handleToggle = () => {
    toggleMute();
    if (isMuted) {
      setTimeout(() => playShimmer(), 100);
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={isMuted ? "Enable Ambient Horological Sound" : "Mute Sound"}
      className={`relative p-2 text-silver-dark hover:text-gold transition-colors duration-300 rounded-full hover:bg-white/5 flex items-center gap-1.5 ${className}`}
      data-cursor="SOUND"
      aria-label="Toggle ambient sound"
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-gold animate-pulse" />
          <span className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 h-1.5 bg-gold animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-0.5 h-3 bg-gold animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-0.5 h-2 bg-gold animate-bounce" style={{ animationDelay: "300ms" }} />
          </span>
        </>
      )}
    </button>
  );
};
