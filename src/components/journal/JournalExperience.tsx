"use client";

import { getFeaturedPosts, getJournalPosts, substack } from "@/content/journal";
import { JournalPost } from "@/components/journal/JournalPost";
import { enter, exit, markFocus, TIMING, handover } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";

// Her top posts first (most-liked first), then everything else, newest
// first — each post exactly once.
const featured = getFeaturedPosts();
const posts = [...featured, ...getJournalPosts().filter((post) => !post.featured)];

const FRAME = "flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:py-16";
const EYEBROW = "font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase";

/**
 * The Substack chapter (internally "journal"): Khizra's writing as a
 * sequence of posts moving through the space one at a time — never a
 * grid, never all at once. An opening frame, each post in turn, and a
 * closing invitation to read the rest on Substack.
 */
export function JournalExperience() {
  return (
    <>
      <div data-frame className={FRAME}>
        <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
          <p className={EYEBROW}>Substack</p>
          <h2 className="mt-5 font-display text-[clamp(3rem,8vw,7.5rem)] leading-none font-semibold text-ink">
            Substack
          </h2>
          <p className="mt-8 max-w-xl font-sans text-lg text-ink-muted sm:text-2xl">
            {substack.bio}
          </p>
          <p className="mt-4 font-sans text-sm text-ink-muted">
            Personal essays by {substack.author}
          </p>
        </div>
      </div>

      {posts.map((post, i) => (
        <JournalPost key={post.url} post={post} index={i} />
      ))}

      <div data-frame className={FRAME}>
        <div data-layer="text" className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0">
          <a
            href={substack.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex flex-col gap-5 [--focus-offset:12px]"
          >
            <span className={EYEBROW}>{substack.publication}</span>
            <span className="origin-left font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[1.05] font-semibold text-ink transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.04]">
              Read all on Substack <span aria-hidden>↗</span>
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </>
  );
}

/**
 * Opening frame → each post → closing frame. Every item enters while the
 * previous one exits (same moment, opposite directions), so there's
 * always exactly one piece of writing settling into focus. Within a
 * post, the cover image travels a little further than the text, which
 * reads as depth.
 */
export const buildJournal: ChapterBuilder = (tl, at, chapter) => {
  const frames = Array.from(chapter.querySelectorAll<HTMLElement>(":scope > [data-frame]"));
  let t = at;

  frames.forEach((frame, i) => {
    const text = frame.querySelector("[data-layer='text']");
    const media = frame.querySelector("[data-layer='media']");
    const last = i === frames.length - 1;

    enter(tl, text, t);
    if (media) enter(tl, media, t, { depth: 1.6, scale: 0.9, duration: TIMING.enter + 0.1 });
    const focus = t + TIMING.enter + (media ? 0.1 : 0);
    markFocus(frame, focus);

    const hold = i === 0 || last ? TIMING.hold + 0.15 : TIMING.hold;
    const leave = focus + hold;
    exit(tl, text, leave);
    if (media) exit(tl, media, leave, { depth: 1.5, scale: 0.9 });

    t = last ? leave : leave + handover();
  });

  return t;
};
