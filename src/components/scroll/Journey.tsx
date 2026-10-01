"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/components/motion/useGsap";
import {
  isChapterId,
  registerChapterNavigator,
  setStationScroll,
} from "@/components/motion/chapters";
import type { ChapterId } from "@/components/motion/chapters";
import { EASE, layout } from "@/components/scroll/transitions";
import { COMPACT_QUERY, saveJourneyLength } from "@/components/scroll/journeyLength";
import type { Timeline } from "@/components/scroll/transitions";

/**
 * Adds a chapter's transitions to the journey timeline, starting at
 * `at` (in screens of scroll), scoped to the chapter's own element.
 * Returns the time at which the next chapter should begin entering —
 * i.e. when this chapter's final exit starts — so chapters overlap
 * instead of meeting at a hard boundary.
 */
type Place = { id: ChapterId; within: number };

export type ChapterBuilder = (tl: Timeline, at: number, chapter: HTMLElement) => number;

export type JourneyChapter = {
  id: ChapterId;
  /** Accessible name for the chapter's region. */
  label: string;
  build: ChapterBuilder;
  content: ReactNode;
};

/**
 * The homepage's single scroll system.
 *
 * Structure: a tall spacer (its height is the timeline's length in
 * screens, plus one) containing a sticky, full-viewport stage. Every
 * chapter composition lives on that stage, layered in the same space —
 * nothing is stacked down the page. Scrolling doesn't move content past
 * the viewport; it moves the playhead of one GSAP timeline.
 *
 * Motion: each chapter contributes its enters/holds/exits to that one
 * timeline via its builder, and a single ScrollTrigger scrubs it across
 * the spacer. Because it's all one scrubbed timeline, stopping mid-way
 * leaves the page in a genuine in-between state, and scrolling back up
 * reverses everything exactly. Lenis (set up in SmoothScroll) supplies
 * the smoothing; nothing here has its own clock.
 *
 * It also:
 * - publishes each chapter's scroll position, so the 3D camera's
 *   stations follow the same timeline;
 * - marks which frames are currently legible (`data-active`), so only
 *   those take pointer input (see globals.css);
 * - travels to a chapter for the navigation, for URL hashes on load,
 *   and when keyboard focus lands in a frame that isn't in view yet.
 *
 * Responsive: the timeline is built for a layout class (see `layout` in
 * transitions.ts — phone vs larger, stacked hero name or not) under
 * gsap.matchMedia, which reverts and rebuilds it whenever that class
 * changes, e.g. on rotating a phone. Within a class, distances are
 * functions of the viewport and are recomputed on every refresh.
 *
 * Reduced motion: no timeline at all. The same chapters render as a
 * plain, readable sequence down the page (see the motion-safe/-reduce
 * classes), and navigation falls back to ordinary anchor scrolling.
 */
export function Journey({ chapters }: { chapters: JourneyChapter[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    // A URL hash is honoured once, on load — not again on every rebuild.
    let honourHash = true;
    // Where the visitor is in the story — a chapter and how far through it
    // — kept up to date while they scroll and carried across rebuilds and
    // refreshes. Pixel positions don't survive those (rotating a phone
    // roughly halves the page's height), but a place in the story does.
    let place: Place | null = null;
    // The width/orientation the current measurements belong to. A scroll
    // event caused by a resize (the browser clamping to a shorter page)
    // arrives before ScrollTrigger re-measures, so it says nothing about
    // where the visitor is and mustn't move `place`. Height alone is left
    // out: a mobile toolbar showing or hiding changes it constantly, and
    // ScrollTrigger doesn't re-measure for that.
    const viewportKey = () =>
      `${window.innerWidth}:${window.matchMedia("(orientation: portrait)").matches}`;
    let measuredFor = "";
    // ScrollTrigger scrolls to the top while it measures; nothing it does
    // mid-refresh says where the visitor is either.
    let refreshing = false;
    const refreshStarted = () => (refreshing = true);
    const refreshEnded = () => (refreshing = false);
    ScrollTrigger.addEventListener("refreshInit", refreshStarted);
    ScrollTrigger.addEventListener("refresh", refreshEnded);
    mm.add(
      {
        // gsap only calls back when at least one condition matches, and on
        // desktop none of the others do.
        any: "all",
        reduce: "(prefers-reduced-motion: reduce)",
        compact: COMPACT_QUERY,
        stacked: "(max-width: 39.99rem)",
        short: "(max-height: 31.25rem)",
      },
      (context) => {
        const { reduce, compact, stacked, short } = context.conditions as Record<string, boolean>;
        layout.compact = compact;
        layout.stacked = stacked;
        layout.short = short;

        const scrollTo = (y: number, immediate = false) => {
          const smooth = lenisRef.current;
          if (smooth) smooth.scrollTo(y, immediate ? { immediate: true } : { duration: 2.4 });
          else window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
        };

        if (reduce) {
          for (const { id } of chapters) {
            const el = document.getElementById(id);
            if (el) setStationScroll(id, el.getBoundingClientRect().top + window.scrollY);
          }
          registerChapterNavigator((id) => {
            const el = document.getElementById(id);
            if (el) scrollTo(el.getBoundingClientRect().top + window.scrollY);
          });
          return () => registerChapterNavigator(null);
        }

        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
        const startTimes = new Map<ChapterId, number>();
        let t = 0;
        for (const chapter of chapters) {
          const el = root.querySelector<HTMLElement>(`[data-chapter-id="${chapter.id}"]`);
          if (!el) continue;
          startTimes.set(chapter.id, t);
          t = chapter.build(tl, t, el);
        }
        // Make sure the timeline runs to the last chapter's end, even if
        // that chapter ends on a hold rather than a tween.
        if (t > tl.duration()) tl.set({}, {}, t);
        const total = tl.duration();
        // The spacer's height *is* the timeline length: 1 screen of scroll
        // per unit of time, plus the stage itself.
        root.style.setProperty("--journey-length", String(total));
        // Remembered so the next load can lay the page out at full height
        // before hydration (see journeyLength.ts), and Lenis re-measured
        // now — it caches the scroll limit, and would otherwise clamp any
        // immediate jump (a hash, a restored position) to the old height.
        saveJourneyLength(compact, total);
        lenisRef.current?.resize();

        const order = Array.from(startTimes);
        const bounds = (i: number) => [order[i][1], order[i + 1]?.[1] ?? total] as const;
        const placeAt = (time: number): Place => {
          let i = order.length - 1;
          while (i > 0 && order[i][1] > time) i--;
          const [from, to] = bounds(i);
          return { id: order[i][0], within: to > from ? (time - from) / (to - from) : 0 };
        };
        const timeAt = ({ id, within }: Place) => {
          const i = order.findIndex(([chapter]) => chapter === id);
          if (i < 0) return 0;
          const [from, to] = bounds(i);
          return from + within * (to - from);
        };

        const frames = Array.from(root.querySelectorAll<HTMLElement>("[data-frame]"));
        const probes = frames.map((frame) => {
          const layers = frame.querySelectorAll<HTMLElement>("[data-layer]");
          return layers.length ? Array.from(layers) : [frame];
        });
        const syncActive = () => {
          frames.forEach((frame, i) => {
            const visible = Math.max(...probes[i].map((el) => Number(gsap.getProperty(el, "opacity"))));
            const active = visible > 0.6 ? "true" : "false";
            if (frame.dataset.active !== active) frame.dataset.active = active;
          });
        };

        // Once a refresh has completely finished — including any rebuild
        // gsap.matchMedia runs inside it, and ScrollTrigger restoring its
        // own scroll position — go back to the remembered place.
        const returnToPlace = () => {
          measuredFor = viewportKey();
          if (!place) return;
          const y = scrollForTime(timeAt(place));
          if (Math.abs(y - window.scrollY) > 2) {
            lenisRef.current?.resize();
            scrollTo(y, true);
          }
        };
        ScrollTrigger.addEventListener("refresh", returnToPlace);

        const trigger = ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          animation: tl,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            syncActive();
            if (!refreshing && viewportKey() === measuredFor) place = placeAt(self.progress * total);
          },
          onRefresh: () => publishStations(),
        });

        const scrollForTime = (time: number) =>
          trigger.start + (time / total) * (trigger.end - trigger.start);

        function publishStations() {
          startTimes.forEach((time, id) => setStationScroll(id, scrollForTime(time)));
        }
        publishStations();
        syncActive();
        measuredFor = viewportKey();

        // A chapter's destination is its first frame at full focus.
        const focusTimeOf = (id: ChapterId) => {
          const first = root.querySelector<HTMLElement>(`[data-chapter-id="${id}"] [data-frame]`);
          const time = Number(first?.dataset.focusTime);
          return Number.isFinite(time) ? time : (startTimes.get(id) ?? 0);
        };

        // Going home is a return to the opening, not a journey back through
        // every chapter in reverse — so it jumps straight there.
        registerChapterNavigator((id) =>
          id === "hero" ? scrollTo(0, true) : scrollTo(scrollForTime(focusTimeOf(id)))
        );

        // Keyboard users tabbing forward land on frames that haven't
        // arrived yet — bring the one holding focus into view.
        const onFocusIn = (event: FocusEvent) => {
          const frame = (event.target as Element | null)?.closest<HTMLElement>("[data-frame]");
          if (!frame || frame.dataset.active === "true") return;
          const time = Number(frame.dataset.focusTime);
          if (Number.isFinite(time)) scrollTo(scrollForTime(time), true);
        };
        root.addEventListener("focusin", onFocusIn);

        const hash = honourHash ? window.location.hash.slice(1) : "";
        honourHash = false;
        let hashFrame = 0;
        if (hash && isChapterId(hash)) {
          hashFrame = requestAnimationFrame(() => scrollTo(scrollForTime(focusTimeOf(hash)), true));
        } else {
          // A rebuild for a new layout class: carry on from the same place.
          // (If a refresh follows, the listener above does it again after.)
          returnToPlace();
        }

        return () => {
          ScrollTrigger.removeEventListener("refresh", returnToPlace);
          cancelAnimationFrame(hashFrame);
          root.removeEventListener("focusin", onFocusIn);
          registerChapterNavigator(null);
        };
      }
    );
    return () => {
      mm.revert();
      ScrollTrigger.removeEventListener("refreshInit", refreshStarted);
      ScrollTrigger.removeEventListener("refresh", refreshEnded);
    };
  }, [chapters]);

  return (
    <div
      ref={rootRef}
      data-journey
      // The negative margin lifts the journey under the nav (and any
      // safe area above it), so "centered" means centered in the real
      // viewport. The spacer is measured in svh so the scroll length never
      // changes as a mobile browser's toolbars show and hide; the stage is
      // dvh so it always exactly fills what's visible.
      className="relative -mt-[var(--nav-offset)] motion-safe:h-[calc((var(--journey-length,1)+1)*100svh)]"
    >
      <div
        data-stage
        className="top-0 motion-safe:sticky motion-safe:h-dvh motion-safe:overflow-hidden"
      >
        {chapters.map((chapter) => (
          <section
            key={chapter.id}
            id={chapter.id}
            aria-label={chapter.label}
            data-chapter-id={chapter.id}
            className="motion-safe:absolute motion-safe:inset-0"
          >
            {chapter.content}
          </section>
        ))}
      </div>
    </div>
  );
}
