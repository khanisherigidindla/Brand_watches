"use client";

import React from "react";

export type LightingPreset =
  | "LuxuryStudio"
  | "DarkStudio"
  | "GoldStudio"
  | "SilverStudio"
  | "CollectorStudio";

export const LightingSystem: React.FC<{ preset?: LightingPreset }> = ({
  preset = "LuxuryStudio",
}) => {
  return (
    <>
      <ambientLight intensity={preset === "DarkStudio" ? 0.3 : 0.7} />

      {/* Key Light */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={preset === "GoldStudio" ? 2.5 : 2.0}
        color={preset === "GoldStudio" ? "#fef3c7" : "#ffffff"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill Light */}
      <directionalLight
        position={[-5, -2, -3]}
        intensity={preset === "DarkStudio" ? 0.4 : 1.0}
        color={preset === "SilverStudio" ? "#e0f2fe" : "#fef9c3"}
      />

      {/* Dramatic Metallic Rim Light */}
      <spotLight
        position={[0, 8, -4]}
        intensity={preset === "DarkStudio" ? 4.0 : 2.2}
        angle={0.6}
        penumbra={0.8}
        color={preset === "GoldStudio" ? "#d4af37" : "#93c5fd"}
      />

      {/* Dial Highlight Point Light */}
      <pointLight
        position={[0, 0, 3.2]}
        intensity={0.8}
        color="#ffffff"
        distance={6}
      />
    </>
  );
};
