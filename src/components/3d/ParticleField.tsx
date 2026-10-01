"use client";

import { useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeColors } from "@/components/3d/useThemeColors";
import { opennessAt } from "@/components/3d/cameraPath";

// The field is a slab of space around the camera's route: DEPTH world
// units deep along z, wrapping as the camera travels, so the space reads
// as endless while only ever holding a handful of particles. BEHIND is
// how far behind the camera a particle may sit before it wraps to the
// far end — both ends of the wrap are fully faded out, so it's never seen.
const DEPTH = 34;
const BEHIND = 3;
// Half-height of the field; half-width follows the viewport aspect so a
// portrait phone isn't spending particles far off-screen.
const HALF_HEIGHT = 6;

const RADIUS = 0.13;
const BASE_OPACITY = 0.36;

type Particle = {
  nx: number;
  ny: number;
  z: number;
  phase: THREE.Vector3;
  driftSpeed: number;
  bobSpeed: number;
  scale: number;
  colorRoll: number;
  keep: number;
};

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    nx: Math.random() * 2 - 1,
    ny: Math.random() * 2 - 1,
    // Evenly stratified in depth (with jitter) so the field never
    // bunches up into a visible wall or gap as it wraps.
    z: -((i + Math.random()) / count) * DEPTH,
    phase: new THREE.Vector3(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ),
    driftSpeed: 0.025 + Math.random() * 0.04,
    bobSpeed: 0.05 + Math.random() * 0.05,
    scale: 0.5 + Math.random() * 1.1,
    colorRoll: Math.random(),
    keep: Math.random(),
  }));
}

// Generated once, at module scope — outside any component or hook, so this
// randomness never runs during React's render phase. Two fixed variants
// (desktop/mobile) rather than generating at runtime.
const PARTICLES_FULL = buildParticles(30);
const PARTICLES_SIMPLIFIED = buildParticles(16);
const ALPHA_FULL = new Float32Array(PARTICLES_FULL.length);
const ALPHA_SIMPLIFIED = new Float32Array(PARTICLES_SIMPLIFIED.length);

// Per-instance opacity for the standard material: a tiny shader patch
// multiplying the fragment alpha by an instanced `aAlpha` attribute.
function patchShader(shader: THREE.WebGLProgramParametersWithUniforms) {
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\nattribute float aAlpha;\nvarying float vAlpha;")
    .replace("#include <begin_vertex>", "#include <begin_vertex>\nvAlpha = aAlpha;");
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", "#include <common>\nvarying float vAlpha;")
    .replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.a *= vAlpha;");
}
const programCacheKey = () => "particle-field-alpha";

const matrix = new THREE.Matrix4();
const color = new THREE.Color();

function mod(a: number, n: number) {
  return ((a % n) + n) % n;
}

/**
 * A sparse field of soft, translucent spheres filling a deep volume the
 * camera travels through — no connecting lines, no recognizable shape.
 * Nearly every particle is a neutral ink tone; only one or two carry a
 * pink or green tint.
 *
 * Depth does the work: perspective makes near particles larger and
 * faster-moving on screen (parallax) and far ones small and slow. On top
 * of that, opacity is shaped by distance — far particles dissolve into
 * the paper, very near ones are softened (a restrained, depth-of-field-
 * like cue with no post-processing) — and the field thins out in the
 * open region the path reaches near the end.
 *
 * Per-frame transforms and alphas are written straight into the
 * instanced buffers through the mesh ref.
 */
export function ParticleField({ simplified = false }: { simplified?: boolean }) {
  const colors = useThemeColors();
  const particles = simplified ? PARTICLES_SIMPLIFIED : PARTICLES_FULL;
  const alphas = simplified ? ALPHA_SIMPLIFIED : ALPHA_FULL;
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    particles.forEach((p, i) => {
      color.set(p.colorRoll > 0.95 ? colors.pink : p.colorRoll > 0.91 ? colors.green : colors.inkMuted);
      mesh.setColorAt(i, color);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles, colors]);

  useFrame((state) => {
    const mesh = meshRef.current;
    const alphaAttr = mesh?.geometry.getAttribute("aAlpha");
    if (!mesh || !alphaAttr) return;
    const t = state.clock.getElapsedTime();
    const cam = state.camera;
    const aspect = THREE.MathUtils.clamp(state.size.width / Math.max(state.size.height, 1), 0.55, 1.9);
    const halfWidth = HALF_HEIGHT * aspect;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Distance ahead of the camera along the travel axis, wrapped into
      // [-BEHIND, DEPTH - BEHIND).
      const ahead = mod(cam.position.z - p.z + BEHIND, DEPTH) - BEHIND;
      const z = cam.position.z - ahead + Math.sin(t * p.driftSpeed + p.phase.z) * 0.35;
      const x = p.nx * halfWidth + Math.sin(t * p.driftSpeed + p.phase.x) * 0.4;
      const y =
        p.ny * HALF_HEIGHT +
        Math.cos(t * p.driftSpeed + p.phase.y) * 0.35 +
        Math.sin(t * p.bobSpeed + p.phase.x) * 0.12;

      const s = RADIUS * p.scale;
      matrix.makeScale(s, s, s).setPosition(x, y, z);
      mesh.setMatrixAt(i, matrix);

      // Depth-shaped opacity: dissolve at the far end and right at the
      // camera (so wrapping is invisible), softer when close, crispest
      // in the middle distance.
      const depth = cam.position.z - z;
      const far = 1 - THREE.MathUtils.smoothstep(depth, 14, DEPTH - BEHIND - 2);
      const near = THREE.MathUtils.smoothstep(depth, 0.8, 3.2);
      const soft = 0.5 + 0.5 * THREE.MathUtils.smoothstep(depth, 2.5, 7);
      const thin = opennessAt(z) * 0.55;
      const sparse = 1 - THREE.MathUtils.smoothstep(thin, p.keep, p.keep + 0.12);
      alphaAttr.setX(i, BASE_OPACITY * far * near * soft * sparse);
    }

    mesh.instanceMatrix.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particles.length]} frustumCulled={false}>
      {/* Particles are a few px across on a phone; 12 segments is indistinguishable there. */}
      <sphereGeometry args={simplified ? [1, 12, 12] : [1, 20, 20]}>
        <instancedBufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
      </sphereGeometry>
      <meshStandardMaterial
        transparent
        roughness={0.7}
        metalness={0}
        depthWrite={false}
        toneMapped={false}
        onBeforeCompile={patchShader}
        customProgramCacheKey={programCacheKey}
      />
    </instancedMesh>
  );
}
