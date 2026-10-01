"use client";

import { hero } from "@/content/home";
import { HeroCat, addCatToTimeline } from "@/components/home/HeroCat";
import { EASE, markFocus, riseTo } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";

/** Screens of scroll over which the name shrinks and rises (~800px on a laptop). */
const HERO_RANGE = 0.9;
const SHRUNK = 0.4;

const [firstName, ...otherNames] = hero.headline.split(" ");

/**
 * The opening: the name, large and centered in the viewport, floating
 * over the persistent 3D background. Its scroll-driven shrink is the
 * model for every other transition on the page (see transitions.ts).
 */
export function Hero() {
  return (
    <div
      data-frame
      className="flex h-svh items-center justify-center px-gutter motion-safe:absolute motion-safe:inset-0 motion-safe:h-auto"
    >
      {/* The heading's size lives on this wrapper (.hero-name, globals.css), so the cat (sized in em) always matches it. */}
      <div data-hero-name data-layer="name" className="hero-name relative will-change-transform">
        {/* One line from `sm` up; two centred lines on narrow portrait screens. */}
        <h1 className="text-center font-display text-[1em] leading-none font-semibold whitespace-nowrap text-ink">
          <span className="max-sm:block">{firstName}</span> <span className="max-sm:block">{otherNames.join(" ")}</span>
        </h1>
        <HeroCat />
        {/* Positioned out of flow, so only the name determines what's centered.
            Its width follows the viewport, not the (narrower, stacked) name. */}
        <p
          data-hero-tagline
          className="absolute top-full left-1/2 mt-8 w-[min(28rem,100vw_-_2*var(--gutter))] -translate-x-1/2 text-center font-sans text-base text-balance text-ink-muted max-sm:mt-7 sm:text-lg short:mt-4"
        >
          {hero.subheadline}
        </p>
      </div>
    </div>
  );
}

/**
 * Scroll 0 → HERO_RANGE: scale 1 → 0.4, rising to a fifth of the way down
 * the viewport (-30vh from centre; measured, so a short landscape screen
 * stops it below the nav), opacity 1 → 0.25
 * (the tagline fades over the first part). The name then lingers, small
 * and faint, while the Substack chapter opens beneath it, and finally
 * drifts up and out as the first post arrives.
 */
export const buildHero: ChapterBuilder = (tl, at, chapter) => {
  const name = chapter.querySelector<HTMLElement>("[data-hero-name]");
  const tagline = chapter.querySelector("[data-hero-tagline]");
  markFocus(chapter.querySelector("[data-frame]"), at);
  if (!name) return at;
  const risen = riseTo(name, SHRUNK);

  tl.fromTo(
    name,
    { scale: 1, y: 0, opacity: 1 },
    {
      scale: SHRUNK,
      y: risen,
      opacity: 0.25,
      ease: "sine.inOut",
      duration: HERO_RANGE,
    },
    at
  );
  tl.fromTo(tagline, { opacity: 1 }, { opacity: 0, duration: 0.4, ease: "none" }, at);
  // The cat wakes, walks off along the name and leaps away within the same range.
  addCatToTimeline(tl, at, chapter);
  tl.to(name, { y: () => risen() - 0.12 * window.innerHeight, opacity: 0, duration: 0.6, ease: EASE }, at + 1.5);

  // The next chapter starts entering while the name is still shrinking.
  return at + 0.45;
};
