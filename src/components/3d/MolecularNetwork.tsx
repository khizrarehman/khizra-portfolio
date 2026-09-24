"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { useThemeColors } from "@/components/3d/useThemeColors";

const NODE_COUNT = 36;
const FIELD_RADIUS = 2.5;
const CONNECT_DISTANCE = 1.1;

type FieldNode = {
  base: THREE.Vector3;
  phase: number;
  speed: number;
  colorRoll: number;
};

function randomInSphere(radius: number) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = radius * Math.cbrt(Math.random());
  return new THREE.Vector3(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

// Generated once, at module scope — outside any component or hook, so this
// randomness never runs during React's render phase (keeps render pure).
const NODES: FieldNode[] = Array.from({ length: NODE_COUNT }, () => ({
  base: randomInSphere(FIELD_RADIUS),
  phase: Math.random() * Math.PI * 2,
  speed: 0.3 + Math.random() * 0.35,
  colorRoll: Math.random(),
}));

function buildConnectionGeometry() {
  const positions: number[] = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      if (NODES[i].base.distanceTo(NODES[j].base) < CONNECT_DISTANCE) {
        positions.push(
          NODES[i].base.x,
          NODES[i].base.y,
          NODES[i].base.z,
          NODES[j].base.x,
          NODES[j].base.y,
          NODES[j].base.z
        );
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

// Also static — the connections depend only on the fixed node layout above.
const CONNECTION_GEOMETRY = buildConnectionGeometry();

/**
 * A loose molecular network around the helix: small instanced nodes,
 * mostly neutral with occasional pink/green highlights, connected by
 * very thin lines when close together. One instanced draw call for all
 * nodes, one line-segments draw call for the connections (built once,
 * from the nodes' base positions — the tiny per-frame drift doesn't
 * warrant recomputing an O(n²) connection graph every frame).
 *
 * Per-frame drift is written directly to each instance's ref (the
 * sanctioned mutable escape hatch), not to a value returned from
 * useMemo/useState.
 */
export function MolecularNetwork() {
  const colors = useThemeColors();
  const instanceRefs = useRef<Array<THREE.Object3D | null>>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < NODES.length; i++) {
      const instance = instanceRefs.current[i];
      if (!instance) continue;
      const node = NODES[i];
      instance.position.set(
        node.base.x,
        node.base.y + Math.sin(t * node.speed + node.phase) * 0.09,
        node.base.z
      );
    }
  });

  return (
    <group>
      <Instances limit={NODES.length}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial
          transparent
          opacity={0.85}
          roughness={0.6}
          metalness={0}
          toneMapped={false}
        />
        {NODES.map((node, i) => {
          const color =
            node.colorRoll > 0.92
              ? colors.pink
              : node.colorRoll > 0.84
                ? colors.green
                : colors.inkMuted;
          return (
            <Instance
              key={i}
              ref={(el) => {
                instanceRefs.current[i] = el as THREE.Object3D | null;
              }}
              position={node.base}
              color={color}
            />
          );
        })}
      </Instances>
      <lineSegments geometry={CONNECTION_GEOMETRY}>
        <lineBasicMaterial color={colors.line} transparent opacity={0.3} toneMapped={false} />
      </lineSegments>
    </group>
  );
}
