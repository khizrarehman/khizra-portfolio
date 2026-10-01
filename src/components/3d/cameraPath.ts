import * as THREE from "three";
import { LAST_STATION, journeyAt } from "@/components/motion/chapters";

/**
 * The camera's single continuous route through the environment. One
 * smooth spline, travelling mostly forward (-z): a gentle drift sideways
 * after the intro, a slow return through journal, and a wider swing out
 * into a more open region for archive/about. There are no per-section
 * scenes — every chapter is just a stretch of this one path.
 */
const PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 8),
    new THREE.Vector3(0.05, -0.03, 4.5),
    new THREE.Vector3(0.8, -0.2, -0.5),
    new THREE.Vector3(0.4, 0.25, -5.5),
    new THREE.Vector3(-1, 0.15, -11),
    new THREE.Vector3(-1.5, 0.05, -15),
  ],
  false,
  "centripetal"
);

/**
 * Relative camera speed at each point of the journey (0 = hero, 1 =
 * intro, … LAST_STATION = about): nearly still on the hero, easing into
 * motion through hero → intro, a steady glide through the middle
 * chapters, then gradually slowing to rest as about arrives. Smooth
 * everywhere, so speed never changes abruptly.
 */
function speed(j: number) {
  const start = THREE.MathUtils.smoothstep(j, 0.05, 1.2);
  const end = 1 - 0.92 * THREE.MathUtils.smoothstep(j, LAST_STATION - 2.2, LAST_STATION);
  return 0.02 + start * end;
}

// Distance travelled as a function of scroll, integrated per pixel of
// scroll (not per chapter) so a short chapter doesn't make the camera
// rush — the glide has the same pace everywhere in the middle of the
// page. Normalised to [0, 1] to index the arc-length-parameterised path.
// Rebuilt only when the page layout (the stations) changes.
const SAMPLES = 400;
const distance = new Float32Array(SAMPLES + 1);
let cachedStations = "";

function buildDistanceTable(stations: number[]) {
  const max = stations[LAST_STATION];
  distance[0] = 0;
  for (let i = 1; i <= SAMPLES; i++) {
    const scroll = ((i - 0.5) / SAMPLES) * max;
    distance[i] = distance[i - 1] + speed(journeyAt(scroll, stations));
  }
  for (let i = 1; i <= SAMPLES; i++) distance[i] /= distance[SAMPLES];
}

function pathParam(scroll: number, stations: number[]) {
  const key = stations.join(",");
  if (key !== cachedStations) {
    buildDistanceTable(stations);
    cachedStations = key;
  }
  const x = THREE.MathUtils.clamp(scroll / stations[LAST_STATION], 0, 1) * SAMPLES;
  const i = Math.min(Math.floor(x), SAMPLES - 1);
  return THREE.MathUtils.lerp(distance[i], distance[i + 1], x - i);
}

/** Writes the camera position and forward direction for `scroll`. */
export function sampleCameraPath(
  scroll: number,
  stations: number[],
  position: THREE.Vector3,
  forward: THREE.Vector3
) {
  const u = pathParam(scroll, stations);
  PATH.getPointAt(u, position);
  PATH.getTangentAt(u, forward);
}

/**
 * How "open" the environment is at a given world z: 0 through the
 * denser early chapters, rising towards 1 in the region the path
 * reaches for archive/about. The particle field thins out accordingly.
 */
export function opennessAt(z: number) {
  return THREE.MathUtils.smoothstep(-z, 9, 22);
}
