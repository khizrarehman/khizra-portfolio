"use client";

import { experience } from "@/content/experience";
import { enter, exit, markFocus, TIMING, handover } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";

const FRAME = "flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:py-16";
const EYEBROW = "font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase";

/**
 * Experience as a short chronological narrative: one role at a time,
 * each entering as the previous one leaves.
 */
export function ExperienceChapter() {
  return (
    <>
      {experience.map((item) => (
        <div key={item.organization} data-frame className={FRAME}>
          <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
            <p className={EYEBROW}>
              Experience · {item.period}
              {item.duration ? ` · ${item.duration}` : ""}
            </p>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,5.75rem)] leading-[1] font-semibold text-ink short:text-[clamp(1.75rem,5vw,2.75rem)]">
              {item.organization}
            </h2>
            <p className="mt-4 font-sans text-base text-ink-muted sm:text-lg short:mt-2 short:text-sm">
              {item.role}
              {item.unit ? <span className="block text-sm">{item.unit}</span> : null}
            </p>
            <p className="mt-8 max-w-2xl font-sans text-lg leading-relaxed text-ink sm:text-xl short:mt-4 short:text-base">
              {item.narrative}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

export const buildExperience: ChapterBuilder = (tl, at, chapter) => {
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
