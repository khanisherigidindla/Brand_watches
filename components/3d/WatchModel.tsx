"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WatchProduct } from "@/lib/types/watch";

interface WatchModelProps {
  product?: Partial<WatchProduct>;
  isHero?: boolean;
  exploded?: boolean;
}

export const WatchModel: React.FC<WatchModelProps> = ({
  product,
  isHero = false,
  exploded = false,
}) => {
  const watchGroupRef = useRef<THREE.Group>(null);
  const balanceWheelRef = useRef<THREE.Group>(null);
  const tourbillonCageRef = useRef<THREE.Group>(null);
  const gear1Ref = useRef<THREE.Mesh>(null);
  const gear2Ref = useRef<THREE.Mesh>(null);
  const secondsHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);

  const preset = product?.modelPreset || {
    metalColor: "#e2e8f0",
    bezelColor: "#1e3a8a",
    dialColor: "#0f172a",
    gemColor: "#2563eb",
    strapColor: "#94a3b8",
    accentColor: "#fbbf24",
    roughness: 0.15,
    metalness: 0.95,
    hasGems: true,
    gemType: "sapphire" as const,
  };

  useFrame((state, delta) => {
    // 1. Oscillating Tourbillon & Balance Wheel escapement
    if (balanceWheelRef.current) {
      // Rapid 4Hz balance spring oscillation
      balanceWheelRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 24) * 0.45;
    }
    if (tourbillonCageRef.current) {
      // Tourbillon cage rotates 360 degrees every 60 seconds
      tourbillonCageRef.current.rotation.z += delta * 0.4;
    }

    // 2. Interlocking gear trains
    if (gear1Ref.current) {
      gear1Ref.current.rotation.z += delta * 0.25;
    }
    if (gear2Ref.current) {
      gear2Ref.current.rotation.z -= delta * 0.35;
    }

    // 3. Sweeping second hand & smooth time progression
    if (secondsHandRef.current) {
      secondsHandRef.current.rotation.z -= delta * 0.6;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z -= (delta * 0.6) / 60;
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z -= (delta * 0.6) / 720;
    }

    // 4. Subtle breathing float if hero
    if (isHero && watchGroupRef.current) {
      watchGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      watchGroupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  // Metallic PBR materials
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: preset.metalColor,
    metalness: preset.metalness,
    roughness: preset.roughness,
  });

  const goldAccentMaterial = new THREE.MeshStandardMaterial({
    color: "#d4af37",
    metalness: 0.92,
    roughness: 0.2,
  });

  const darkPlateMaterial = new THREE.MeshStandardMaterial({
    color: "#18181b",
    metalness: 0.8,
    roughness: 0.3,
  });

  const gemMaterial = new THREE.MeshPhysicalMaterial({
    color: preset.gemColor || "#2563eb",
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.85,
    ior: 1.77, // Sapphire refractive index
    thickness: 0.3,
  });

  const sapphireGlassMaterial = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    metalness: 0.05,
    roughness: 0.02,
    transmission: 0.95,
    ior: 1.77,
    thickness: 0.2,
    transparent: true,
    opacity: 0.35,
  });

  const rubyJewelMaterial = new THREE.MeshStandardMaterial({
    color: "#be123c",
    metalness: 0.3,
    roughness: 0.1,
  });

  // Exploded spacing offsets
  const explodeZ = exploded ? 0.35 : 0;

  return (
    <group ref={watchGroupRef} dispose={null} scale={1.2}>
      {/* 1. MAIN CASE & LUGS */}
      <mesh material={metalMaterial} castShadow receiveShadow position={[0, 0, -0.05]}>
        {/* Outer watch case barrel */}
        <cylinderGeometry args={[1.5, 1.5, 0.35, 64]} />
      </mesh>

      {/* Lugs (Top and Bottom) */}
      <group position={[0, 1.45, -0.05]}>
        <mesh position={[-0.8, 0.25, 0]} material={metalMaterial}>
          <boxGeometry args={[0.22, 0.6, 0.3]} />
        </mesh>
        <mesh position={[0.8, 0.25, 0]} material={metalMaterial}>
          <boxGeometry args={[0.22, 0.6, 0.3]} />
        </mesh>
      </group>
      <group position={[0, -1.45, -0.05]}>
        <mesh position={[-0.8, -0.25, 0]} material={metalMaterial}>
          <boxGeometry args={[0.22, 0.6, 0.3]} />
        </mesh>
        <mesh position={[0.8, -0.25, 0]} material={metalMaterial}>
          <boxGeometry args={[0.22, 0.6, 0.3]} />
        </mesh>
      </group>

      {/* 2. CROWN & CHRONO PUSHERS (at 3, 2, and 4 o'clock) */}
      <group position={[1.55, 0, -0.05]}>
        {/* Winding Crown with knurled ridges */}
        <mesh rotation={[0, 0, Math.PI / 2]} material={goldAccentMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.25, 32]} />
        </mesh>
        <mesh position={[0.14, 0, 0]} material={gemMaterial}>
          <sphereGeometry args={[0.08, 16, 16]} />
        </mesh>
      </group>
      {/* Chrono Pusher 2 o'clock */}
      <mesh position={[1.42, 0.65, -0.05]} rotation={[0, 0, Math.PI / 3]} material={metalMaterial}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
      </mesh>
      {/* Chrono Pusher 4 o'clock */}
      <mesh position={[1.42, -0.65, -0.05]} rotation={[0, 0, -Math.PI / 3]} material={metalMaterial}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
      </mesh>

      {/* 3. LUXURY BEZEL WITH SAPPHIRE/DIAMOND BAGUETTES */}
      <group position={[0, 0, 0.12 + explodeZ * 0.3]}>
        {/* Bezel Ring */}
        <mesh material={metalMaterial}>
          <torusGeometry args={[1.42, 0.08, 16, 64]} />
        </mesh>

        {/* 36 Baguette Jewels around the bezel (matches user's uploaded watch) */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i / 36) * Math.PI * 2;
          const radius = 1.42;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <mesh
              key={i}
              position={[x, y, 0.03]}
              rotation={[0, 0, angle + Math.PI / 2]}
              material={i % 3 === 0 ? metalMaterial : gemMaterial}
            >
              <boxGeometry args={[0.07, 0.12, 0.05]} />
            </mesh>
          );
        })}
      </group>

      {/* 4. CHAPTER RING & DIAL INDICES */}
      <group position={[0, 0, 0.08 + explodeZ * 0.2]}>
        <mesh material={darkPlateMaterial}>
          <ringGeometry args={[1.2, 1.34, 64]} />
        </mesh>
        {/* Hour Batons */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const x = Math.sin(angle) * 1.25;
          const y = Math.cos(angle) * 1.25;
          return (
            <mesh
              key={i}
              position={[x, y, 0.02]}
              rotation={[0, 0, -angle]}
              material={goldAccentMaterial}
            >
              <boxGeometry args={[0.04, 0.12, 0.03]} />
            </mesh>
          );
        })}
      </group>

      {/* 5. SKELETONIZED MOVEMENT & GEAR TRAIN */}
      <group position={[0, 0, 0.02]}>
        {/* Baseplate / Bridge Openwork */}
        <mesh position={[0, 0.3, -0.04]} material={darkPlateMaterial}>
          <circleGeometry args={[0.9, 32]} />
        </mesh>

        {/* Large Barrel Gear (Top) */}
        <mesh ref={gear1Ref} position={[0, 0.45, 0.01]} material={goldAccentMaterial}>
          <cylinderGeometry args={[0.38, 0.38, 0.04, 32]} />
        </mesh>

        {/* Center Transmission Gear */}
        <mesh ref={gear2Ref} position={[-0.32, -0.05, 0.02]} material={metalMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 28]} />
        </mesh>

        {/* Synthetic Rubies */}
        <mesh position={[-0.32, -0.05, 0.04]} material={rubyJewelMaterial}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        </mesh>
        <mesh position={[0, 0.45, 0.03]} material={rubyJewelMaterial}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        </mesh>

        {/* 6. TOURBILLON & ESCAPEMENT AT 6 O'CLOCK */}
        <group position={[0, -0.55, 0.02]}>
          {/* Tourbillon Aperture Ring */}
          <mesh material={goldAccentMaterial}>
            <torusGeometry args={[0.38, 0.02, 16, 32]} />
          </mesh>

          {/* Rotating Tourbillon Cage */}
          <group ref={tourbillonCageRef}>
            <mesh material={metalMaterial}>
              <boxGeometry args={[0.6, 0.05, 0.02]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={metalMaterial}>
              <boxGeometry args={[0.6, 0.05, 0.02]} />
            </mesh>

            {/* Oscillating Balance Wheel inside cage */}
            <group ref={balanceWheelRef}>
              <mesh material={goldAccentMaterial}>
                <torusGeometry args={[0.26, 0.02, 16, 32]} />
              </mesh>
              <mesh material={metalMaterial}>
                <boxGeometry args={[0.5, 0.03, 0.01]} />
              </mesh>
              {/* Balance Wheel Screws */}
              <mesh position={[0.26, 0, 0]} material={rubyJewelMaterial}>
                <sphereGeometry args={[0.025, 8, 8]} />
              </mesh>
              <mesh position={[-0.26, 0, 0]} material={rubyJewelMaterial}>
                <sphereGeometry args={[0.025, 8, 8]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* 7. HANDSET (Hour, Minute, and Sweeping Second Hand) */}
      <group position={[0, 0, 0.12 + explodeZ * 0.4]}>
        {/* Central Pinion Cap */}
        <mesh material={goldAccentMaterial}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
        </mesh>

        {/* Hour Hand */}
        <group ref={hourHandRef} rotation={[0, 0, Math.PI / 4]}>
          <mesh position={[0, 0.35, 0.01]} material={goldAccentMaterial}>
            <boxGeometry args={[0.06, 0.7, 0.015]} />
          </mesh>
          <mesh position={[0, 0.7, 0.01]} rotation={[0, 0, Math.PI / 4]} material={goldAccentMaterial}>
            <boxGeometry args={[0.07, 0.07, 0.015]} />
          </mesh>
        </group>

        {/* Minute Hand */}
        <group ref={minuteHandRef} rotation={[0, 0, -Math.PI / 3]}>
          <mesh position={[0, 0.52, 0.02]} material={metalMaterial}>
            <boxGeometry args={[0.045, 1.05, 0.015]} />
          </mesh>
        </group>

        {/* Sweeping Needle Second Hand */}
        <group ref={secondsHandRef}>
          <mesh position={[0, 0.48, 0.03]} material={gemMaterial}>
            <boxGeometry args={[0.02, 1.25, 0.01]} />
          </mesh>
          {/* Counterbalance */}
          <mesh position={[0, -0.22, 0.03]} material={gemMaterial}>
            <boxGeometry args={[0.04, 0.35, 0.01]} />
          </mesh>
        </group>
      </group>

      {/* 8. SAPPHIRE CRYSTAL GLASS COVER */}
      <mesh
        position={[0, 0, 0.16 + explodeZ * 0.6]}
        material={sapphireGlassMaterial}
      >
        <cylinderGeometry args={[1.36, 1.36, 0.04, 64]} />
      </mesh>

      {/* 9. STAINLESS STEEL / PLATINUM MULTI-LINK BRACELET */}
      <group position={[0, 0, -0.1]}>
        {/* Top bracelet segments */}
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={`top-link-${i}`} position={[0, 1.8 + i * 0.45, -i * 0.12]}>
            <mesh material={metalMaterial}>
              <boxGeometry args={[1.1 - i * 0.06, 0.4, 0.14]} />
            </mesh>
            {/* Center link polished contrast */}
            <mesh position={[0, 0, 0.02]} material={goldAccentMaterial}>
              <boxGeometry args={[0.35, 0.41, 0.15]} />
            </mesh>
          </group>
        ))}

        {/* Bottom bracelet segments */}
        {Array.from({ length: 4 }).map((_, i) => (
          <group key={`bot-link-${i}`} position={[0, -1.8 - i * 0.45, -i * 0.12]}>
            <mesh material={metalMaterial}>
              <boxGeometry args={[1.1 - i * 0.06, 0.4, 0.14]} />
            </mesh>
            <mesh position={[0, 0, 0.02]} material={goldAccentMaterial}>
              <boxGeometry args={[0.35, 0.41, 0.15]} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};
