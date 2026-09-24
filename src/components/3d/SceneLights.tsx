"use client";

import { useThemeColors } from "@/components/3d/useThemeColors";

/**
 * Soft, minimal lighting for the biological scene — just enough for the
 * mostly-transparent standard materials to pick up gentle shading and
 * depth. No shadow maps, no post-processing: a bright hemisphere fill
 * (so nothing goes flat-black) plus two neutral, undecayed point lights
 * for soft highlights. Lights stay neutral/warm rather than pink or
 * green on purpose — each node's own material color should carry the
 * accent, not colored illumination bleeding across the whole scene.
 */
export function SceneLights() {
  const colors = useThemeColors();

  return (
    <>
      <hemisphereLight args={[colors.paper, colors.inkMuted, 2.6]} />
      <pointLight position={[3, 2, 4]} intensity={3.2} decay={0} color={colors.paper} />
      <pointLight position={[-3, -1.5, 2.5]} intensity={2} decay={0} color={colors.ink} />
    </>
  );
}
