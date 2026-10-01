"use client";

import type { gsap } from "gsap";

/**
 * The site's one transition vocabulary, generalised from the hero's name
 * animation: content arrives from slightly below and slightly smaller,
 * settles, then leaves upward, a little smaller again, fading as it goes.
 * The next piece of content arrives while the previous one leaves, so
 * there's never an empty "between sections" moment.
 *
 * Time is measured in screens of scroll: a duration of 1 is one viewport
 * height of scrolling. All tweens live on the single Journey timeline and
 * are scrubbed by scroll, so any intermediate position is a real,
 * reversible state.
 */

export type Timeline = gsap.core.Timeline;
type Targets = gsap.TweenTarget;

/**
 * The layout the journey is currently built for. Journey sets this (via
 * gsap.matchMedia) before every build and rebuilds when it changes, so
 * builders can simply read it.
 * - compact: phones, portrait or landscape. Shorter travel, and a
 *   handover in which the outgoing item has mostly faded before the next
 *   one is strong — on a small screen each item fills most of the view,
 *   so two at equal strength would be unreadable.
 * - stacked: the hero name is on two lines (see .hero-name).
 * - short: a landscape phone, where headers need to give up more height.
 */
export const layout = { compact: false, stacked: false, short: false };

/** Default travel for enters/exits, as a fraction of viewport height. */
function travel() {
  if (typeof window === "undefined") return 0;
  return (layout.compact ? 0.1 : 0.16) * window.innerHeight;
}

export const EASE = "power1.inOut";

export const TIMING = {
  enter: 0.7,
  hold: 0.35,
  exit: 0.7,
} as const;

/**
 * How far into an exit the next item starts entering. The two still
 * overlap (one continuous handover), but the outgoing item gets a head
 * start so they never sit on top of each other at equal strength.
 */
export function handover() {
  return layout.compact ? 0.38 : 0.25;
}

type MoveOptions = {
  duration?: number;
  /** Multiplies the travel distance — >1 for layers that should feel nearer. */
  depth?: number;
  scale?: number;
  ease?: string;
};

/** Rise into place: opacity 0 → 1, y +travel → 0, scale → 1. */
export function enter(tl: Timeline, targets: Targets, at: number, options: MoveOptions = {}) {
  const { duration = TIMING.enter, depth = 1, scale = 0.95, ease = EASE } = options;
  tl.fromTo(
    targets,
    { opacity: 0, y: () => travel() * depth, scale },
    { opacity: 1, y: 0, scale: 1, duration, ease },
    at
  );
  return at + duration;
}

/** Leave upward: opacity → 0, y → -travel, slightly smaller. */
export function exit(tl: Timeline, targets: Targets, at: number, options: MoveOptions = {}) {
  const { duration = TIMING.exit, depth = 1, scale = 0.93, ease = EASE } = options;
  if (layout.compact) {
    // Same movement, but the fade completes in the first ~60%.
    tl.to(targets, { y: () => -travel() * depth, scale, duration, ease }, at);
    tl.to(targets, { opacity: 0, duration: duration * 0.6, ease: "power1.in" }, at);
  } else {
    tl.to(targets, { opacity: 0, y: () => -travel() * depth, scale, duration, ease }, at);
  }
  return at + duration;
}

/**
 * Marks when a frame is fully in focus, so keyboard focus and chapter
 * navigation can travel to it.
 */
export function markFocus(frame: Element | null, time: number) {
  if (frame instanceof HTMLElement) frame.dataset.focusTime = String(time);
}

/** An element's untransformed vertical centre, in px from the top of the stage. */
function stageCenter(el: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && !node.hasAttribute("data-stage")) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top + el.offsetHeight / 2;
}

/**
 * The y offset that lifts `el`, once scaled by `scale`, into a header
 * position: its centre at `ratio` of the viewport height — but never so
 * high that it slides under the navigation, which matters on short
 * (landscape) screens. Measured, so it holds for any composition; a
 * function, so it's recomputed whenever ScrollTrigger refreshes.
 */
export function riseTo(el: HTMLElement, scale: number, ratio = 0.2) {
  return () => {
    const nav = document.querySelector("header nav")?.getBoundingClientRect().bottom ?? 64;
    const target = Math.max(ratio * window.innerHeight, nav + 12 + (el.offsetHeight * scale) / 2);
    return target - stageCenter(el);
  };
}
