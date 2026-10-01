"use client";

/**
 * The homepage's chapters, in journey order. Shared between <Journey>
 * (which owns the single scroll timeline and knows where each chapter
 * begins), the 3D background (which turns those positions into one
 * continuous camera journey) and the navigation (which travels to them).
 *
 * Ids double as URL anchors (/#substack, /#research, …).
 */
export const CHAPTER_IDS = [
  "hero",
  "substack",
  "research",
  "archive",
  "experience",
  "education",
  "about",
] as const;
export type ChapterId = (typeof CHAPTER_IDS)[number];

export const LAST_STATION = CHAPTER_IDS.length - 1;

export function isChapterId(value: string): value is ChapterId {
  return (CHAPTER_IDS as readonly string[]).includes(value);
}

// Scroll position at which each chapter begins, written by <Journey>
// whenever its ScrollTrigger (re)measures.
const stationScroll = new Map<ChapterId, number>();

export function setStationScroll(id: ChapterId, scroll: number) {
  stationScroll.set(id, scroll);
}

/**
 * Scroll positions of each station: 0 for the hero, each chapter's
 * start, and the bottom of the page for the last one. Kept strictly
 * increasing so no segment has zero length (a zero-length segment would
 * be an instantaneous jump). Written into `out` to avoid per-frame
 * allocation.
 */
export function getStations(out: number[]) {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  out[0] = 0;
  for (let k = 1; k <= LAST_STATION; k++) {
    const raw = k === LAST_STATION ? max : (stationScroll.get(CHAPTER_IDS[k]) ?? max);
    out[k] = Math.max(Math.min(raw, max), out[k - 1] + 1);
  }
  return out;
}

/**
 * A single continuous value in [0, LAST_STATION] describing how far the
 * visitor has travelled through the page at `scroll`: 0 at the very top
 * (hero), k at station k, LAST_STATION at the bottom of the page —
 * linear in scroll between stations. Derived purely from scroll position
 * and the measured stations, so it never resets or jumps; scrolling back
 * up runs it in reverse.
 */
export function journeyAt(scroll: number, stations: number[]) {
  for (let k = 1; k <= LAST_STATION; k++) {
    if (scroll < stations[k]) {
      return k - 1 + Math.max(0, scroll - stations[k - 1]) / (stations[k] - stations[k - 1]);
    }
  }
  return LAST_STATION;
}

// Travelling to a chapter needs the live Journey (its timeline and the
// smooth-scroll instance), so it registers itself here while mounted.
let navigator: ((id: ChapterId) => void) | null = null;

export function registerChapterNavigator(fn: ((id: ChapterId) => void) | null) {
  navigator = fn;
}

/** Scrolls to a chapter if the journey is on screen; false otherwise. */
export function goToChapter(id: ChapterId) {
  if (!navigator) return false;
  navigator(id);
  return true;
}

/** The inverse of journeyAt: the scroll position for journey value `j`. */
export function scrollAtJourney(j: number, stations: number[]) {
  const clamped = Math.min(Math.max(j, 0), LAST_STATION);
  const k = Math.min(Math.floor(clamped), LAST_STATION - 1);
  return stations[k] + (clamped - k) * (stations[k + 1] - stations[k]);
}
