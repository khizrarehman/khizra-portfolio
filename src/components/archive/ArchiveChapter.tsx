"use client";

import { creativeWork } from "@/content/creative";
import { archive } from "@/content/home";
import { enter, exit, markFocus, TIMING, handover } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";

const FRAME = "flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:py-16";
const EYEBROW = "font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase";

/**
 * The creative archive. While creative.ts is empty (nothing verified has
 * been added yet, and nothing is invented) the chapter is a single quiet
 * interlude between Research and Experience — a line, not a section
 * heading over an empty gallery — and the nav leaves it out (navLinks.ts).
 * Once work is added, the full opening returns and each work becomes its
 * own frame in the same enter/exit sequence.
 */
export function ArchiveChapter() {
  if (creativeWork.length === 0) {
    return (
      <div data-frame className={FRAME}>
        <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
          <p className={EYEBROW}>{archive.eyebrow}</p>
          <p className="mt-5 max-w-2xl font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.12] text-balance text-ink-muted">
            {archive.interlude}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div data-frame className={FRAME}>
        <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
          <p className={EYEBROW}>{archive.eyebrow}</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,8vw,7.5rem)] leading-none font-semibold text-ink">
            {archive.title}
          </h2>
          <p className="mt-8 max-w-xl font-sans text-lg text-ink-muted sm:text-xl">{archive.description}</p>
        </div>
      </div>

      {creativeWork.map((work) => (
        <div key={work.slug} data-frame className={FRAME}>
          <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
            <p className={EYEBROW}>{[work.medium, work.date].filter(Boolean).join(" · ")}</p>
            <h3 className="mt-5 font-display text-[clamp(2.25rem,5vw,5rem)] leading-[1.02] font-semibold text-ink">
              {work.title}
            </h3>
            {work.description ? (
              <p className="mt-6 max-w-xl font-sans text-lg text-ink-muted">{work.description}</p>
            ) : null}
          </div>
        </div>
      ))}
    </>
  );
}

export const buildArchive: ChapterBuilder = (tl, at, chapter) => {
  let t = at;
  chapter.querySelectorAll<HTMLElement>(":scope > [data-frame]").forEach((frame) => {
    const text = frame.querySelector("[data-layer='text']");
    const focus = enter(tl, text, t);
    markFocus(frame, focus);
    const leave = focus + TIMING.hold + 0.15;
    exit(tl, text, leave);
    t = leave + handover();
  });
  // The next chapter takes over from the last exit.
  return t - handover();
};
