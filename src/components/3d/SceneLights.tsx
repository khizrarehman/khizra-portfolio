"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { useThemeColors } from "@/components/3d/useThemeColors";

/**
 * Soft, minimal lighting for the particle field — just enough for the
 * translucent spheres to pick up gentle shading and depth. No shadow
 * maps, no post-processing: a bright hemisphere fill (so nothing goes
 * flat-black) plus two low, neutral point lights for soft highlights.
 * Lights stay neutral/warm rather than pink or green on purpose — each
 * particle's own material color should carry the rare accent, not
 * colored illumination bleeding across the whole field.
 *
 * The point lights travel with the camera, so shading stays consistent
 * wherever the camera is along its path.
 */
export function SceneLights() {
  const colors = useThemeColors();
  const rig = useRef<THREE.Group>(null);

  useFrame((state) => {
    rig.current?.position.copy(state.camera.position);
  });

  return (
    <>
      <hemisphereLight args={[colors.paper, colors.inkMuted, 2.2]} />
      <group ref={rig}>
        <pointLight position={[3, 2, -4]} intensity={2.4} decay={0} color={colors.paper} />
        <pointLight position={[-3, -1.5, -5.5]} intensity={1.6} decay={0} color={colors.ink} />
      </group>
    </>
  );
}
