"use client";

import { profile } from "@/content/profile";
import { substack } from "@/content/journal";
import { enter, markFocus } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";

const EYEBROW = "font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase";

/**
 * The closing chapter: Khizra's own introduction, arriving last and
 * staying — nothing follows it on the stage.
 */
export function AboutChapter() {
  return (
    <div
      data-frame
      // Phones center it in the space below the nav — it's the longest text frame.
      className="flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:py-24 max-sm:motion-safe:pt-[var(--nav-offset)]"
    >
      <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
        <p className={EYEBROW}>About</p>
        <p className="mt-6 max-w-3xl font-display text-[clamp(1.4rem,2.6vw,2.4rem)] leading-[1.22] text-ink max-sm:mt-4 max-sm:text-[min(1.4rem,3.1svh)] short:mt-3 short:text-[1.1rem]">
          {profile.intro}
        </p>
        <p className="mt-10 max-w-2xl font-sans text-base leading-relaxed text-ink-muted max-sm:mt-6 max-sm:text-[min(1rem,2.3svh)] sm:text-lg short:mt-4 short:text-sm">
          {profile.about}
        </p>
        <a
          href={substack.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block py-2 font-sans max-sm:mt-4 short:mt-2 text-sm tracking-wide text-ink underline decoration-line underline-offset-4 transition-colors hover:text-pink hover:decoration-pink"
        >
          {substack.author} on Substack <span aria-hidden>↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

export const buildAbout: ChapterBuilder = (tl, at, chapter) => {
  const frame = chapter.querySelector("[data-frame]");
  const text = chapter.querySelector("[data-layer='text']");
  const focus = enter(tl, text, at, { duration: 0.8 });
  markFocus(frame, focus);
  // Holds to the end of the journey.
  return focus + 0.8;
};
