"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sampleCameraPath } from "@/components/3d/cameraPath";
import { PAW_BOX, PAW_PRINTS, PAW_WORLD_SIZE, pawStore } from "@/components/3d/pawTrail";
import { getStations, scrollAtJourney } from "@/components/motion/chapters";

const MAX_OPACITY = 0.55;
const SPECIAL_OPACITY = 0.7;

const stations: number[] = [];
const anchor = new THREE.Vector3();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3();
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const view = new THREE.Vector3();
const ndc = new THREE.Vector3();

/**
 * Renders nothing in WebGL: each frame it projects the paw prints' world
 * positions through the scene camera and writes the result onto their
 * DOM elements — position, perspective size, depth-based opacity and a
 * very small organic drift. Running inside the canvas's own frame loop
 * keeps the prints locked to the particles and camera, frame for frame.
 */
export function PawProjector() {
  const world = useRef<THREE.Vector3[]>(PAW_PRINTS.map(() => new THREE.Vector3()));
  const layoutKey = useRef("");

  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const aspect = width / Math.max(height, 1);

    // (Re)compute world positions only when the layout changes.
    getStations(stations);
    const key = `${stations.join(",")}|${aspect.toFixed(3)}`;
    if (key !== layoutKey.current) {
      layoutKey.current = key;
      PAW_PRINTS.forEach((print, i) => {
        sampleCameraPath(scrollAtJourney(print.journey, stations), stations, anchor, forward);
        right.crossVectors(forward, WORLD_UP).normalize();
        up.crossVectors(right, forward).normalize();
        const halfH = tanHalf * print.ahead;
        world.current[i]
          .copy(anchor)
          .addScaledVector(forward, print.ahead)
          .addScaledVector(right, print.x * halfH * aspect)
          .addScaledVector(up, print.y * halfH);
      });
    }

    const t = state.clock.getElapsedTime();
    const pxPerUnit = height / 2 / tanHalf;

    PAW_PRINTS.forEach((print, i) => {
      const el = pawStore.elements[i];
      if (!el) return;
      const p = world.current[i];

      view.copy(p).applyMatrix4(cam.matrixWorldInverse);
      const depth = -view.z;
      // Fade in as the camera approaches, out as it passes — never abrupt.
      const opacity =
        depth <= 0.2
          ? 0
          : (print.special ? SPECIAL_OPACITY : MAX_OPACITY) *
            THREE.MathUtils.smoothstep(depth, 1.1, 1.9) *
            (1 - THREE.MathUtils.smoothstep(depth, 3.4, 4.5));

      ndc.copy(p).project(cam);
      const phase = i * 1.7;
      const dx = Math.sin(t * 0.5 + phase) * 1.5;
      const dy = Math.cos(t * 0.4 + phase) * 1.5;
      const wobble = Math.sin(t * 0.3 + phase) * 3;
      const x = (ndc.x * 0.5 + 0.5) * width + dx;
      const y = (-ndc.y * 0.5 + 0.5) * height + dy;
      const scale = (PAW_WORLD_SIZE * (print.size ?? 1) * pxPerUnit) / Math.max(depth, 0.2) / PAW_BOX;

      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${(print.rotate + wobble).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      const interactive = opacity > 0.15;
      el.style.pointerEvents = interactive ? "auto" : "none";
      el.dataset.visible = interactive ? "true" : "false";

      if (print.special && pawStore.message) {
        pawStore.message.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - PAW_BOX * scale * 0.9).toFixed(1)}px, 0) translate(-50%, -100%)`;
      }
    });
  });

  return null;
}
