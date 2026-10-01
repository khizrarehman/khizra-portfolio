"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCameraPath } from "@/components/3d/cameraPath";
import { getStations } from "@/components/motion/chapters";

// How quickly the camera catches up with its scroll-derived target.
// Low values give it weight: it keeps gliding briefly after the scroll
// stops, rather than being bolted to the scrollbar.
const POSITION_DAMPING = 2.2;
const LOOK_DAMPING = 1.6;

const target = new THREE.Vector3();
const forward = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const stations: number[] = [];

/**
 * Drives the camera along the single continuous path in cameraPath.ts.
 * Each frame: read the scroll position, sample the path's
 * position and direction there, and damp the camera towards them. A very
 * small ambient sway keeps the view alive when scroll is at rest (most
 * noticeable on the hero, where the camera is otherwise still).
 *
 * The first frame snaps straight to the target, so loading the page
 * mid-scroll never plays a fly-in from the top.
 */
export function SceneController() {
  const { camera } = useThree();

  // Mirrored into a ref (rather than mutating the hook-returned `camera`
  // directly) — three.js objects are inherently mutable, and a ref is
  // the correct escape hatch for that.
  const cameraRef = useRef(camera);
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const look = useRef(new THREE.Vector3());
  const initialised = useRef(false);

  useFrame((state, delta) => {
    const cam = cameraRef.current;
    const t = state.clock.getElapsedTime();

    sampleCameraPath(window.scrollY, getStations(stations), target, forward);
    target.x += Math.sin(t * 0.07) * 0.06;
    target.y += Math.sin(t * 0.05 + 1.3) * 0.04;
    lookTarget.copy(target).addScaledVector(forward, 12);

    if (!initialised.current) {
      cam.position.copy(target);
      look.current.copy(lookTarget);
      initialised.current = true;
    } else {
      // Frame-rate-independent exponential damping on each axis.
      const d = Math.min(delta, 0.1);
      cam.position.x = THREE.MathUtils.damp(cam.position.x, target.x, POSITION_DAMPING, d);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, target.y, POSITION_DAMPING, d);
      cam.position.z = THREE.MathUtils.damp(cam.position.z, target.z, POSITION_DAMPING, d);
      look.current.x = THREE.MathUtils.damp(look.current.x, lookTarget.x, LOOK_DAMPING, d);
      look.current.y = THREE.MathUtils.damp(look.current.y, lookTarget.y, LOOK_DAMPING, d);
      look.current.z = THREE.MathUtils.damp(look.current.z, lookTarget.z, LOOK_DAMPING, d);
    }
    cam.lookAt(look.current);
  });

  return null;
}
