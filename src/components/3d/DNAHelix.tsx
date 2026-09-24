"use client";

import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors } from "@/components/3d/useThemeColors";

const TURNS = 2.25;
const POINTS_PER_STRAND = 26;
const HEIGHT = 3.4;
const HELIX_RADIUS = 0.5;

function strandPoint(t: number, offset: number) {
  const angle = t * Math.PI * 2 * TURNS + offset;
  const y = (t - 0.5) * HEIGHT;
  return new THREE.Vector3(Math.cos(angle) * HELIX_RADIUS, y, Math.sin(angle) * HELIX_RADIUS);
}

/**
 * The hero's central double helix — one strand pink, the other the
 * muted biological green, joined by faint rungs. A soft, semi-transparent
 * standard material lets it pick up shading from SceneLights instead of
 * reading as a flat, unlit shape. It's static geometry: it only moves as
 * part of the parent scene rig in BiologicalScene.
 */
export function DNAHelix() {
  const colors = useThemeColors();

  const strandA = useMemo(
    () =>
      Array.from({ length: POINTS_PER_STRAND }, (_, i) =>
        strandPoint(i / (POINTS_PER_STRAND - 1), 0)
      ),
    []
  );
  const strandB = useMemo(
    () =>
      Array.from({ length: POINTS_PER_STRAND }, (_, i) =>
        strandPoint(i / (POINTS_PER_STRAND - 1), Math.PI)
      ),
    []
  );

  const rungGeometry = useMemo(() => {
    const positions: number[] = [];
    strandA.forEach((p, i) => {
      if (i % 3 !== 0) return;
      const q = strandB[i];
      positions.push(p.x, p.y, p.z, q.x, q.y, q.z);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [strandA, strandB]);

  return (
    <group position={[1.15, 0, -0.6]} rotation={[0.32, 0.45, 0.15]}>
      <Instances limit={strandA.length + strandB.length}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial
          transparent
          opacity={0.92}
          roughness={0.5}
          metalness={0.05}
          toneMapped={false}
        />
        {strandA.map((p, i) => (
          <Instance key={`a-${i}`} position={p} color={colors.pink} />
        ))}
        {strandB.map((p, i) => (
          <Instance key={`b-${i}`} position={p} color={colors.green} />
        ))}
      </Instances>
      <lineSegments geometry={rungGeometry}>
        <lineBasicMaterial color={colors.line} transparent opacity={0.5} toneMapped={false} />
      </lineSegments>
    </group>
  );
}
