"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the 3D environment is running. Shared between the background
 * (which sets it) and anything that depends on the canvas — the paw
 * prints are positioned by the canvas's frame loop, so without it they
 * have nowhere to be.
 *
 * - "pending": not mounted yet (and always on the server).
 * - "ready": the WebGL renderer was created.
 * - "failed": WebGL is unavailable or the scene threw while starting; the
 *   static 2D field is shown instead.
 */
export type SceneStatus = "pending" | "ready" | "failed";

let status: SceneStatus = "pending";
let checked = false;
const listeners = new Set<() => void>();

export function setSceneStatus(next: SceneStatus) {
  // Once failed, stay failed — a late "ready" from a dying canvas
  // shouldn't bring the 3D back half-working.
  if (status === next || status === "failed") return;
  status = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  // The capability check runs once, the first time anyone asks.
  if (!checked) {
    checked = true;
    if (!supportsWebGL()) status = "failed";
  }
  return status;
}

export function useSceneStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "pending" as const);
}

/**
 * Can this browser create a WebGL context at all? Checked before the
 * scene mounts, so browsers without WebGL never try to start three.js. A context that exists can still fail later; the error
 * boundary in BiologicalBackground covers that.
 */
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    // Release it straight away; the real canvas makes its own.
    (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}
