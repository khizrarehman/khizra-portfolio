"use client";

import { Canvas } from "@react-three/fiber";
import { ParticleField } from "@/components/3d/ParticleField";
import { SceneLights } from "@/components/3d/SceneLights";
import { SceneController } from "@/components/3d/SceneController";
import { PawProjector } from "@/components/3d/PawProjector";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useIsMobile } from "@/components/motion/useIsMobile";
import { setSceneStatus } from "@/components/3d/sceneStatus";

/**
 * The site's persistent biological environment: a single sparse particle
 * field in a transparent canvas (its parent, BiologicalBackground,
 * supplies the fixed full-viewport positioning). Soft standard-material
 * lighting for depth, no post-processing. SceneController moves the
 * camera along one continuous path driven by scroll; ParticleField fills
 * the space around that path and shapes each particle by its depth.
 *
 * On phones (portrait or landscape) the field renders a reduced variant —
 * about half the particles, lower-poly spheres, a lower pixel-ratio cap
 * and a low-power GPU hint — which reads the same at that size. When
 * prefers-reduced-motion is set, the canvas switches to on-demand
 * rendering — it paints one static frame and then stops.
 */
export function BiologicalScene() {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  return (
    <Canvas
      dpr={isMobile ? [1, 1.25] : [1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: isMobile ? "low-power" : "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 42, near: 0.1, far: 60 }}
      frameloop={reducedMotion ? "demand" : "always"}
      onCreated={() => setSceneStatus("ready")}
    >
      <SceneLights />
      <SceneController />
      <ParticleField simplified={isMobile} />
      {/* With reduced motion the camera never travels; PawTrail pins the prints itself. */}
      {reducedMotion ? null : <PawProjector />}
    </Canvas>
  );
}
