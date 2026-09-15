"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows } from "@react-three/drei";
import { WatchModel } from "./WatchModel";
import { LightingSystem, LightingPreset } from "./LightingSystem";
import { CameraController, CameraPreset } from "./CameraController";
import { WatchProduct } from "@/lib/types/watch";

interface WatchCanvasProps {
  product?: Partial<WatchProduct>;
  isHero?: boolean;
  cameraPreset?: CameraPreset;
  lightingPreset?: LightingPreset;
  interactive?: boolean;
  enableZoom?: boolean;
  autoRotate?: boolean;
  exploded?: boolean;
  className?: string;
}

export const WatchCanvas: React.FC<WatchCanvasProps> = ({
  product,
  isHero = false,
  cameraPreset = "hero",
  lightingPreset = "LuxuryStudio",
  interactive = true,
  enableZoom = false,
  autoRotate = false,
  exploded = false,
  className = "w-full h-full min-h-[350px]",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <CameraController preset={cameraPreset} enableMouseParallax={isHero} />
          <LightingSystem preset={lightingPreset} />

          {isHero ? (
            <Float
              speed={1.8}
              rotationIntensity={0.3}
              floatIntensity={0.2}
              floatingRange={[-0.05, 0.05]}
            >
              <WatchModel product={product} isHero={true} exploded={exploded} />
            </Float>
          ) : (
            <WatchModel product={product} isHero={false} exploded={exploded} />
          )}

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.65}
            scale={8}
            blur={2.5}
            far={4}
            color="#000000"
          />

          {interactive && (
            <OrbitControls
              enablePan={false}
              enableZoom={enableZoom}
              minDistance={2.0}
              maxDistance={7.0}
              maxPolarAngle={Math.PI / 1.6}
              minPolarAngle={Math.PI / 3.2}
              autoRotate={autoRotate}
              autoRotateSpeed={0.8}
              dampingFactor={0.06}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
