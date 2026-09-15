"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, ArrowRight, Play, Volume2, VolumeX, Eye } from "lucide-react";
import { useAudioStore } from "@/lib/store/audioStore";

interface CinematicIntroProps {
  onComplete: () => void;
}

const INTRO_FRAMES = [
  "/assets/intro/media_1788505911678.jpg",
  "/assets/intro/media_1788505911680.jpg",
  "/assets/intro/media_1788505911684.jpg",
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [frameIndex, setFrameIndex] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const { isMuted, toggleMute, playShimmer, playTick } = useAudioStore();

  useEffect(() => {
    // Play intro sounds & sequence progression
    const t1 = setTimeout(() => {
      setCurrentScene(2); // Scene 02: Watch silhouette & rim light
      playTick();
      setFrameIndex(0);
    }, 1200);

    const t2 = setTimeout(() => {
      setCurrentScene(3); // Scene 03: Mechanical details & tourbillon gears
      playTick();
      setFrameIndex(1);
    }, 3200);

    const t3 = setTimeout(() => {
      setCurrentScene(4); // Scene 04: Full product reveal & sapphire reflection
      playTick();
      setFrameIndex(2);
    }, 5400);

    const t4 = setTimeout(() => {
      setCurrentScene(5); // Scene 05: Brand reveal - AURA
      playShimmer();
    }, 7600);

    const t5 = setTimeout(() => {
      setCurrentScene(6); // Scene 06: Smooth transition into hero
      setIsFadingOut(true);
    }, 9800);

    const t6 = setTimeout(() => {
      onComplete();
    }, 10800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete, playShimmer, playTick]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 overflow-hidden ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Dynamic Background Frame Sequence with Pan/Zoom Ken-Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {INTRO_FRAMES.map((frameSrc, idx) => (
          <div
            key={frameSrc}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              frameIndex === idx ? "opacity-75 scale-105" : "opacity-0 scale-100"
            }`}
            style={{
              transition: "opacity 1.4s ease-in-out, transform 4s ease-out",
            }}
          >
            <Image
              src={frameSrc}
              alt="Aura Horology Intro Unveil"
              fill
              priority
              className="object-contain md:object-cover filter brightness-[0.7] contrast-[1.15]"
            />
          </div>
        ))}

        {/* Cinematic Vignette & Obsidian Grading */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
      </div>

      {/* Floating Skip & Audio Controls */}
      <div className="absolute top-8 right-8 z-30 flex items-center gap-4">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-gold backdrop-blur-md transition-colors text-xs flex items-center gap-2 font-mono uppercase tracking-widest"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold animate-pulse" />}
          <span className="hidden sm:inline">{isMuted ? "Sound Off" : "Sound On"}</span>
        </button>

        <button
          onClick={handleSkip}
          className="px-4 py-2 rounded-full border border-white/20 hover:border-gold text-white/80 hover:text-gold bg-black/40 backdrop-blur-md transition-all duration-300 text-xs font-mono tracking-ultra-wide uppercase"
          data-cursor="SKIP"
        >
          Skip Intro →
        </button>
      </div>

      {/* Narrative Scene Typography Overlay */}
      <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        {/* Scene 01: Ambient Darkness & Genesis */}
        {currentScene === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <span className="text-[10px] font-mono tracking-super-wide text-gold/60 uppercase">
              Scene 01 · The Inception of Time
            </span>
            <div className="w-12 h-0.5 bg-gold/40 mx-auto" />
            <p className="text-xl md:text-2xl font-serif text-white/60 tracking-widest uppercase">
              In the darkness of space, precision was born.
            </p>
          </div>
        )}

        {/* Scene 02: Watch Silhouette */}
        {currentScene === 2 && (
          <div className="space-y-3 animate-fadeIn">
            <span className="text-[10px] font-mono tracking-super-wide text-gold uppercase">
              Scene 02 · Architectural Silhouette
            </span>
            <h2 className="text-2xl md:text-4xl font-serif text-white tracking-wide">
              Forged in Pure Platinum & Sapphire
            </h2>
            <p className="text-xs md:text-sm font-sans text-silver-dark max-w-md mx-auto">
              Thirty-six hand-selected royal blue baguette sapphires illuminate the escapement.
            </p>
          </div>
        )}

        {/* Scene 03: Mechanical Escapement */}
        {currentScene === 3 && (
          <div className="space-y-3 animate-fadeIn">
            <span className="text-[10px] font-mono tracking-super-wide text-gold uppercase">
              Scene 03 · The Heartbeat of Calibre AUR-9012
            </span>
            <h2 className="text-2xl md:text-4xl font-serif text-white tracking-wide">
              Oscillating at 28,800 Vibrations Per Hour
            </h2>
            <p className="text-xs md:text-sm font-sans text-silver-dark max-w-md mx-auto">
              A flying tourbillon countering the gravity of earth with mathematical equilibrium.
            </p>
          </div>
        )}

        {/* Scene 04: Full Product Reveal */}
        {currentScene === 4 && (
          <div className="space-y-3 animate-fadeIn">
            <span className="text-[10px] font-mono tracking-super-wide text-gold uppercase">
              Scene 04 · Haute Horlogerie Revelation
            </span>
            <h2 className="text-2xl md:text-4xl font-serif text-white tracking-wide">
              Aura Squelette Saphir
            </h2>
            <p className="text-xs md:text-sm font-mono text-gold-champagne tracking-widest uppercase">
              Numbered Limited Series · 50 Pieces Worldwide
            </p>
          </div>
        )}

        {/* Scene 05 & 06: Grand Brand Reveal & Transition into Hero */}
        {(currentScene === 5 || currentScene === 6) && (
          <div className="space-y-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-[9px] font-mono uppercase tracking-super-wide text-gold">
              <Sparkles className="w-3 h-3" /> Manufacture Horlogère Suisse
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white tracking-[0.22em] text-center">
              AURA
            </h1>
            <p className="text-xs md:text-sm font-sans uppercase tracking-[0.35em] text-gold font-medium">
              TIME, ENGINEERED FOR ETERNITY.
            </p>
            <div className="pt-4">
              <span className="text-[10px] font-mono tracking-widest text-silver-dark uppercase animate-pulse">
                Entering Digital Showroom...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Line Indicator */}
      <div className="absolute bottom-8 left-8 right-8 z-30 max-w-xs mx-auto">
        <div className="h-[2px] w-full bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-champagne via-gold to-gold-dark transition-all duration-700 ease-out"
            style={{ width: `${(currentScene / 6) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono text-white/40 mt-2">
          <span>0{currentScene} / 06</span>
          <span className="uppercase tracking-widest text-gold/80">Atelier Aura</span>
        </div>
      </div>
    </div>
  );
};
