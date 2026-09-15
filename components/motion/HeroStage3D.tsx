"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Float, ContactShadows, Environment } from "@react-three/drei";
import { WatchModel } from "@/components/3d/WatchModel";

const HeroParticles = dynamic(() => import("./HeroParticles").then((m) => m.HeroParticles), { ssr: false });

export const HeroStage3D: React.FC = () => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={null}>
          <HeroParticles />
        </Suspense>
      </div>

      <div data-gsap-parallax="0.08" className="relative h-[420px] md:h-[520px]">
        <Canvas camera={{ position: [0, 0.4, 5.2], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffffff" />
          <directionalLight position={[-5, -2, -3]} intensity={0.9} color="#fef9c3" />
          <spotLight position={[0, 8, -4]} intensity={2.6} angle={0.6} penumbra={0.8} color="#d4af37" />
          <pointLight position={[0, 0, 3.2]} intensity={0.9} color="#ffffff" distance={7} />
          <Suspense fallback={null}>
            <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.32} floatingRange={[-0.08, 0.08]}>
              <WatchModel isHero exploded={false} />
            </Float>
            <Environment preset="city" />
            <ContactShadows position={[0, -2.2, 0]} opacity={0.62} scale={9} blur={2.6} far={4.2} color="#000000" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
