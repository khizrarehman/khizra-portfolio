"use client";

import { education } from "@/content/education";
import { enter, exit, markFocus, EASE, TIMING } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";

const EYEBROW = "font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase";

// Oldest first, so the chapter reads forward in time.
const entries = [...education].reverse();

/**
 * Education as a quiet timeline: the earlier degree arrives first, then
 * the later one arrives beneath it while the first recedes — one
 * composition, read downward through time.
 */
export function EducationChapter() {
  return (
    <div
      data-frame
      className="flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:py-16"
    >
      <div className="mx-auto flex w-full max-w-[84rem] flex-col gap-14 px-gutter sm:gap-20 short:gap-5">
        {entries.map((entry, i) => (
          <div key={entry.period} data-entry data-layer="entry" className="motion-safe:opacity-0">
            {i === 0 ? <p className={`${EYEBROW} mb-6 short:mb-3`}>Education</p> : null}
            <p className="font-display text-[clamp(1.25rem,2.4vw,2rem)] text-ink-muted tabular-nums short:text-base">
              {entry.period}
            </p>
            <h2 className="mt-3 max-w-4xl font-display text-[clamp(2.25rem,5.5vw,5.25rem)] leading-[1.02] font-semibold text-ink short:mt-1 short:text-[clamp(1.5rem,4vw,2.25rem)]">
              {entry.field}
            </h2>
            <p className="mt-3 font-sans text-base text-ink-muted sm:text-lg short:mt-1 short:text-sm">
              {[entry.degree, entry.institution, entry.location].filter(Boolean).join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export const buildEducation: ChapterBuilder = (tl, at, chapter) => {
  const frame = chapter.querySelector("[data-frame]");
  const items = Array.from(chapter.querySelectorAll("[data-entry]"));
  let t = at;

  items.forEach((item, i) => {
    enter(tl, item, t);
    // Earlier entries step back as the next one arrives.
    if (i > 0) tl.to(items.slice(0, i), { opacity: 0.35, duration: TIMING.enter, ease: EASE }, t);
    t += TIMING.enter + TIMING.hold;
  });
  markFocus(frame, t - TIMING.hold);

  t += 0.1;
  exit(tl, items, t);
  return t;
};
