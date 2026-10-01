/**
 * The paw-print easter egg: a few tiny traces left in the same world the
 * camera travels through.
 *
 * Each print is placed relative to the camera path rather than at fixed
 * coordinates: at journey value `journey` (see chapters.ts — 1 = the
 * Substack chapter, 2 = Research, …), it sits `ahead` world units in
 * front of the camera, at screen-fraction offsets `x`/`y` (-1…1, right
 * and up) of the view at that depth. So wherever the path or layout is
 * tuned, and on any viewport, each print turns up where intended — and
 * then, being a real point in space, drifts outward and grows as the
 * camera passes it, like everything else in the scene.
 *
 * PawTrail (DOM) renders the prints and registers their elements here;
 * PawProjector (inside the canvas) positions them every frame.
 */

export type PawPrint = {
  journey: number;
  ahead: number;
  x: number;
  y: number;
  rotate: number;
  size?: number;
  special?: boolean;
};

export const PAW_PRINTS: PawPrint[] = [
  // A pair a few posts into the Substack chapter, stepping up and right.
  { journey: 1.3, ahead: 3.0, x: 0.58, y: -0.5, rotate: 20 },
  { journey: 1.3, ahead: 3.45, x: 0.72, y: -0.34, rotate: 28 },
  // A pair as Substack gives way to Research.
  { journey: 1.93, ahead: 3.0, x: 0.3, y: 0.52, rotate: -14 },
  { journey: 1.93, ahead: 3.4, x: 0.44, y: 0.66, rotate: -6 },
  // A single print during Experience.
  { journey: 3.55, ahead: 3.1, x: 0.74, y: 0.46, rotate: -24 },
  // The special one, late in the journey.
  { journey: 5.35, ahead: 3.0, x: 0.62, y: -0.5, rotate: 10, size: 1.3, special: true },
];

/** World-space size of a print (before per-print `size`). */
export const PAW_WORLD_SIZE = 0.05;
/** CSS size of each print's box, in px, at scale 1. */
export const PAW_BOX = 24;

export const pawStore: {
  elements: (HTMLElement | null)[];
  message: HTMLElement | null;
} = {
  elements: [],
  message: null,
};
