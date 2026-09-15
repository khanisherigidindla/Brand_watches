"use client";

import React, { Suspense, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture, ContactShadows, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { WatchProduct } from "@/lib/types/watch";

/**
 * WatchImageShowcase
 * ------------------
 * Renders a watch product PICTURE (from /public/assets/watches) inside a
 * real-time three.js scene and lets the user MOVE it in full 3D:
 *   - Drag to freely rotate the watch in 3D (movable watch).
 *   - Pointer movement adds a cinematic tilt / parallax for depth.
 *   - Gentle auto-rotation while idle.
 *   - 4K / 1080p aware rendering via DPR-aware canvas + high-performance GL.
 */

interface WatchImageShowcaseProps {
  product?: Partial<WatchProduct>;
  image?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  className?: string;
  goldTint?: boolean;
}

function WatchImagePanel({
  image,
  interactive,
  autoRotate,
}: {
  image: string;
  interactive: boolean;
  autoRotate: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const texture = useTexture(image);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = gl.capabilities.getMaxAnisotropy();

  const targetRot = useRef({ x: 0.25, y: 0, z: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const spin = useRef(0);

  // Pointer drag -> full 3D rotation of the watch (movable).
  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!interactive) return;
      const ne = e.nativeEvent;
      isDragging.current = true;
      last.current = { x: ne.clientX, y: ne.clientY };
      try {
        (ne.target as HTMLElement).setPointerCapture?.(ne.pointerId);
      } catch {
        // ignore capture failures
      }
    },
    [interactive],
  );

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    const ne = e.nativeEvent;
    const dx = ne.clientX - last.current.x;
    const dy = ne.clientY - last.current.y;
    last.current = { x: ne.clientX, y: ne.clientY };
    if (isDragging.current) {
      vel.current.x = dy * 0.008;
      vel.current.y = dx * 0.008;
      targetRot.current.x += vel.current.x;
      targetRot.current.y += vel.current.y;
    }
    mouse.current.x = (ne.clientX / window.innerWidth - 0.5) * 2;
    mouse.current.y = -(ne.clientY / window.innerHeight - 0.5) * 2;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (!isDragging.current) {
      const px = mouse.current.x * 0.12;
      const py = -mouse.current.y * 0.12;
      targetRot.current.y += (px - targetRot.current.y) * Math.min(delta * 3, 0.12);
      targetRot.current.x += (py - targetRot.current.x) * Math.min(delta * 3, 0.12);
    } else {
      vel.current.x *= 0.94;
      vel.current.y *= 0.94;
    }

    if (autoRotate && !isDragging.current) {
      spin.current += delta * 0.25;
    }

    g.rotation.x = targetRot.current.x + Math.sin(state.clock.elapsedTime * 0.4) * 0.03;
    g.rotation.y = spin.current + targetRot.current.y;
    g.rotation.z = targetRot.current.z;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group
      ref={group}
      onPointerDown={onPointerDown}
      
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Gold halo underlay */}
      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[2.3, 48]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.06} />
      </mesh>

      {/* The watch image on a rounded 3D panel */}
      <RoundedBox args={[2.4, 2.4, 0.04]} radius={0.12} smoothness={4}>
        <meshStandardMaterial map={texture} metalness={0.35} roughness={0.5} toneMapped />
      </RoundedBox>

      {/* Gold trim rim */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[2.5, 2.5, 0.045]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.25} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
export const WatchImageShowcase: React.FC<WatchImageShowcaseProps> = ({
  product,
  image,
  interactive = true,
  autoRotate = true,
  className = "w-full h-full min-h-[380px]",
  goldTint = true,
}) => {
  const src = image || product?.images?.[0] || "/assets/watches/w-panel-1-1.svg";

  return (
    <div className={`relative ${className}`} style={{ touchAction: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 4.6], fov: 45 }}
        // 4K / 1080p aware: cap pixel ratio at 2 for performance on hi-res screens
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        style={{ touchAction: "none" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={goldTint ? 0.8 : 0.7} />
          <directionalLight
            position={[3, 5, 4]}
            intensity={2.2}
            color={goldTint ? "#fdf3d0" : "#ffffff"}
          />
          <directionalLight position={[-4, -2, -3]} intensity={0.8} color="#cfe8ff" />
          <spotLight
            position={[0, 7, 5]}
            intensity={1.6}
            angle={0.5}
            penumbra={0.9}
            color="#ffe9b0"
          />
          <pointLight position={[0, 0, 3.4]} intensity={0.6} color="#fff" distance={8} />

          <WatchImagePanel image={src} interactive={interactive} autoRotate={autoRotate} />

          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.7}
            scale={9}
            blur={2.6}
            far={4}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};