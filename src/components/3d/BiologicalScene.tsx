"use client";

import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DNAHelix } from "@/components/3d/DNAHelix";
import { MolecularNetwork } from "@/components/3d/MolecularNetwork";
import { SceneLights } from "@/components/3d/SceneLights";
import { useScrollProgress } from "@/components/motion/useScrollProgress";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

/**
 * The scene's one source of motion: a slow ambient drift, a gentle
 * damped tilt toward the pointer, and a subtle extra tilt tied to how
 * far the page has scrolled. Everything else stays still, so the whole
 * environment moves together rather than each part animating on its own.
 *
 * Reads scroll progress from a ref (not React state) so scrolling never
 * triggers a re-render of the scene — only this one useFrame callback.
 */
function SceneRig({
  scrollRef,
  children,
}: {
  scrollRef: RefObject<number>;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    const t = state.clock.getElapsedTime();
    // Ramps up over roughly the first sixth of total page scroll, then holds.
    const scrollTilt = Math.min(scrollRef.current * 6, 1) * 0.18;

    const targetX = state.pointer.y * 0.2 - scrollTilt * 0.4;
    const targetY = Math.PI * 0.12 + t * 0.045 + state.pointer.x * 0.3 + scrollTilt;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 4, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 4, delta);
  });

  return <group ref={group}>{children}</group>;
}

/**
 * Mirrors a reactive value into a ref, so frequently-changing state
 * (page scroll progress) can be read inside a useFrame loop without
 * re-rendering the 3D scene on every update.
 */
function useLiveRef<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

/**
 * The hero's 3D environment: a transparent canvas so the CSS grid behind
 * it stays visible, capped device pixel ratio for performance, and soft
 * standard-material lighting (SceneLights) for depth instead of flat,
 * unlit color. No post-processing.
 *
 * When prefers-reduced-motion is set, the canvas switches to on-demand
 * rendering — it paints one static frame and then stops, rather than
 * running a continuous animation loop.
 */
export function BiologicalScene() {
  const scrollProgress = useScrollProgress();
  const scrollRef = useLiveRef(scrollProgress);
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      frameloop={reducedMotion ? "demand" : "always"}
    >
      <SceneLights />
      <SceneRig scrollRef={scrollRef}>
        <MolecularNetwork />
        <DNAHelix />
      </SceneRig>
    </Canvas>
  );
}
