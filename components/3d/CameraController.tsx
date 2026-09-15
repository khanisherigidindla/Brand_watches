"use client";

import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type CameraPreset =
  | "hero"
  | "front"
  | "movement"
  | "crown"
  | "side"
  | "macro";

const PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  hero: { pos: [0.8, 0.2, 4.2], target: [0, 0, 0] },
  front: { pos: [0, 0, 4.4], target: [0, 0, 0] },
  movement: { pos: [0, -0.7, 2.6], target: [0, -0.6, 0] },
  crown: { pos: [2.8, 0.2, 2.4], target: [1.0, 0, 0] },
  side: { pos: [3.8, 0.1, 1.2], target: [0, 0, 0] },
  macro: { pos: [0, 0.4, 2.1], target: [0, 0.3, 0] },
};

interface CameraControllerProps {
  preset: CameraPreset;
  enableMouseParallax?: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  preset,
  enableMouseParallax = false,
}) => {
  const { camera } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (enableMouseParallax) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableMouseParallax]);

  useFrame((_, delta) => {
    const targetConfig = PRESETS[preset] || PRESETS.hero;

    const desiredX = targetConfig.pos[0] + (enableMouseParallax ? mouse.current.x * 0.3 : 0);
    const desiredY = targetConfig.pos[1] + (enableMouseParallax ? mouse.current.y * 0.3 : 0);
    const desiredZ = targetConfig.pos[2];

    const desiredTargetX = targetConfig.target[0];
    const desiredTargetY = targetConfig.target[1];
    const desiredTargetZ = targetConfig.target[2];

    // Smooth lerp (slow, expensive, cinematic feel)
    const factor = Math.min(delta * 2.8, 0.1);
    camera.position.x += (desiredX - camera.position.x) * factor;
    camera.position.y += (desiredY - camera.position.y) * factor;
    camera.position.z += (desiredZ - camera.position.z) * factor;

    currentTarget.current.x += (desiredTargetX - currentTarget.current.x) * factor;
    currentTarget.current.y += (desiredTargetY - currentTarget.current.y) * factor;
    currentTarget.current.z += (desiredTargetZ - currentTarget.current.z) * factor;

    camera.lookAt(currentTarget.current);
  });

  return null;
};
