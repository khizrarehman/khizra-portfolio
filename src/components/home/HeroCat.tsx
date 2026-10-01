"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { gsap, useGsap } from "@/components/motion/useGsap";
import { layout } from "@/components/scroll/transitions";

/**
 * Where the cat lies on the name, in em of the hero heading (measured
 * from Fraunces at the hero's weight, line-height 1): the tops of the
 * lowercase letters sit 0.411em below the top of the line, and "zr"
 * spans roughly 1.46em → 2.24em. Because everything is in em, the cat
 * stays on the same letters at every viewport size. `left` is measured
 * from the start of "Khizra", which .hero-name publishes as
 * --khizra-left — so it also follows the word when the name stacks onto
 * two centred lines on phones.
 */
const CAT = { left: 1.44, xHeightTop: 0.411, width: 0.8, sink: 0.02 };
const VIEW = { w: 100, h: 55 };

/**
 * A small ink-silhouette cat drawn in the same ink as the name, so it
 * reads as part of the typography rather than a sticker. Three poses in
 * one drawing — asleep, awake (head up, eyes open) and walking — which
 * the hero's scroll timeline and the click interaction crossfade between.
 *
 * Who controls what (so nothing ever fights):
 * - Idle life (breathing, tail) — looping GSAP tweens on inner parts.
 * - Click — sets --woken and plays a one-off stretch on [data-cat-stretch].
 * - Scroll (buildHero) — --wake, the rest→walk crossfade, the leg cycle
 *   and the walk/hop/leap on the outer [data-cat].
 * The sleeping face shows only while both --wake and --woken are 0, so
 * scrolling back to the top returns a sleeping cat to sleep, but a cat
 * that's been woken by a click stays awake.
 */
export function HeroCat() {
  const rootRef = useRef<HTMLButtonElement>(null);
  const [awake, setAwake] = useState(false);
  // The em offsets above are Fraunces measurements; in the fallback font
  // the cat would sit a few px off and then jump. So it stays invisible
  // until the name's own font has loaded (preloaded by next/font, so
  // usually immediately), then fades in where it belongs.
  const [fontReady, setFontReady] = useState(false);

  useEffect(() => {
    const name = rootRef.current?.parentElement?.querySelector("h1");
    const show = () => setFontReady(true);
    if (!name || !document.fonts) return show();
    const { fontWeight, fontFamily } = getComputedStyle(name);
    document.fonts.load(`${fontWeight} 1em ${fontFamily}`).then(show, show);
  }, []);

  useGsap(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Gentle breathing and a slow tail, independent of scroll.
      gsap.to("[data-breathe]", {
        scaleY: 1.045,
        transformOrigin: "50% 100%",
        duration: 1.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to("[data-tail]", {
        rotation: 7,
        svgOrigin: "94 50",
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    rootRef,
    []
  );

  const wake = () => {
    const root = rootRef.current;
    if (!root || awake) return;
    setAwake(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(root, { "--woken": 1 });
      return;
    }
    gsap
      .timeline()
      .to(root, { "--woken": 1, duration: 0.35, ease: "power1.out" }, 0)
      // A small stretch: long and low, then back.
      .to(
        root.querySelector("[data-cat-stretch]"),
        { scaleX: 1.14, scaleY: 0.88, transformOrigin: "50% 100%", duration: 0.45, ease: "sine.inOut" },
        0.1
      )
      .to(root.querySelector("[data-cat-stretch]"), { scaleX: 1, scaleY: 1, duration: 0.7, ease: "back.out(2)" }, 0.6)
      .fromTo(
        root.querySelectorAll("[data-flick]"),
        { rotation: 0 },
        { rotation: -22, svgOrigin: "94 50", duration: 0.22, ease: "sine.out", yoyo: true, repeat: 1 },
        0.55
      );
  };

  // Asleep only while neither scroll nor a click has woken it.
  const asleep = "calc(1 - max(var(--wake), var(--woken)))";
  const awakeMix = "max(var(--wake), var(--woken))";

  return (
    <button
      ref={rootRef}
      type="button"
      data-cat
      onClick={wake}
      aria-label={awake ? "The cat is awake" : "A small cat asleep on the name — wake it"}
      className="absolute block cursor-pointer before:absolute before:-inset-2 before:content-['']"
      style={
        {
          "--wake": 0,
          "--woken": 0,
          left: `calc(${CAT.left}em + var(--khizra-left, 0em))`,
          top: `${CAT.xHeightTop + CAT.sink - (CAT.width * VIEW.h) / VIEW.w}em`,
          width: `${CAT.width}em`,
        } as CSSProperties
      }
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        aria-hidden
        className={`block w-full overflow-visible fill-ink transition-opacity duration-300 ${fontReady ? "opacity-100" : "opacity-0"}`}
      >
        {/* Resting: asleep and awake share the body; only the head changes. */}
        <g data-pose="rest">
          <g data-cat-stretch>
            <Inked>
              <g data-flick>
                <path data-tail d="M93 51 C 103 45, 103 31, 92 31" className="fill-none stroke-ink" strokeWidth="4.5" strokeLinecap="round" />
              </g>
              <path data-breathe d="M13 55 C 11 38, 30 22, 56 22 C 80 22, 97 36, 97 55 Z" />

              {/* Asleep: head tucked low, eyes closed. */}
              <g style={{ opacity: asleep }}>
                <circle cx="21" cy="42" r="13" />
                <path d="M9 36 L 9.5 22 L 19 31 Z M 23 30 L 29 19 L 32.5 32 Z" />
                <path d="M13 43.5 q 3 2.4 6 0 M 22.5 43.5 q 3 2.4 6 0" className="fill-none stroke-paper" strokeWidth="1.6" strokeLinecap="round" />
              </g>

              {/* Awake: head up, ears up, eyes open. */}
              <g style={{ opacity: awakeMix }}>
                <circle cx="22" cy="31" r="13" />
                <path d="M10 25 L 11 9 L 20.5 18 Z M 24 17 L 31 7 L 34 21 Z" />
                <ellipse cx="17.5" cy="31" rx="1.7" ry="2.5" className="fill-paper" />
                <ellipse cx="27" cy="31" rx="1.7" ry="2.5" className="fill-paper" />
                <circle cx="22.5" cy="36" r="1.1" className="fill-pink" />
              </g>
            </Inked>
          </g>
        </g>

        {/* Walking, facing right (scroll takes it off to the right). */}
        <g data-pose="walk" style={{ opacity: 0 }}>
          <Inked>
            <path d="M16 36 C 11 28, 9 16, 17 10" className="fill-none stroke-ink" strokeWidth="4" strokeLinecap="round" />
            <g data-legs="a">
              <path d="M27 38 L 25 54 M 67 38 L 69 54" className="fill-none stroke-ink" strokeWidth="5" strokeLinecap="round" />
            </g>
            <g data-legs="b">
              <path d="M34 38 L 36 54 M 74 38 L 72 54" className="fill-none stroke-ink" strokeWidth="5" strokeLinecap="round" />
            </g>
            <path d="M18 34 C 18 25, 66 22, 76 29 C 81 36, 73 42, 50 42 C 28 42, 18 41, 18 34 Z" />
            <circle cx="83" cy="25" r="11" />
            <path d="M75 19 L 76 6 L 84 14 Z M 86 14 L 93 5 L 94 18 Z" />
            <ellipse cx="88" cy="25" rx="1.5" ry="2.3" className="fill-paper" />
          </Inked>
        </g>
      </svg>
    </button>
  );
}

/**
 * Draws a pose twice: first as a slightly wider paper-coloured silhouette
 * (`.cat-halo`, globals.css), then in ink on top. The paper edge knocks
 * the cat out of the letters it overlaps, so it sits on them instead of
 * merging into them — without outlining its own inner shapes.
 */
function Inked({ children }: { children: ReactNode }) {
  return (
    <>
      <g className="cat-halo">{children}</g>
      <g>{children}</g>
    </>
  );
}

/** Scroll-driven part of the cat's story, placed on the hero's timeline (see buildHero). */
export function addCatToTimeline(tl: gsap.core.Timeline, at: number, root: Element) {
  const cat = root.querySelector("[data-cat]");
  if (!cat) return;
  const em = () => parseFloat(getComputedStyle(cat).fontSize);
  const rest = cat.querySelector("[data-pose='rest']");
  const walk = cat.querySelector("[data-pose='walk']");
  // Both the halo and ink copies move together.
  const legsA = cat.querySelectorAll("[data-legs='a']");
  const legsB = cat.querySelectorAll("[data-legs='b']");

  // ~15–33%: wakes (unless a click already did).
  tl.fromTo(cat, { "--wake": 0 }, { "--wake": 1, duration: 0.16, ease: "sine.inOut" }, at + 0.13);
  // ~33–42%: gets up.
  tl.fromTo(rest, { opacity: 1 }, { opacity: 0, duration: 0.08, ease: "none" }, at + 0.3);
  tl.fromTo(walk, { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none" }, at + 0.3);

  if (layout.stacked) {
    // Stacked name: "Rehman" is on the next line, so there's no "R" to hop
    // onto. It walks to the end of "Khizra", crouches on the "a", then
    // leaps up and away from the word's end — same rhythm, same exit.
    tl.fromTo(cat, { x: 0, y: 0, opacity: 1 }, { x: () => 0.45 * em(), duration: 0.14, ease: "none" }, at + 0.34);
    tl.to(cat, { x: () => 0.6 * em(), y: () => 0.04 * em(), duration: 0.08, ease: "sine.inOut" }, at + 0.48);
    tl.to(cat, { x: () => 0.7 * em(), y: () => -0.2 * em(), duration: 0.06, ease: "sine.out" }, at + 0.56);
    tl.to(cat, { x: () => 1.7 * em(), y: () => -1.2 * em(), opacity: 0, duration: 0.24, ease: "sine.in" }, at + 0.62);
  } else {
    // ~38–95%: walks right over the "a", hops onto the "R", then leaps up and away.
    tl.fromTo(cat, { x: 0, y: 0, opacity: 1 }, { x: () => 0.95 * em(), duration: 0.14, ease: "none" }, at + 0.34);
    tl.to(cat, { x: () => 1.75 * em(), y: () => -0.3 * em(), duration: 0.08, ease: "sine.out" }, at + 0.48);
    tl.to(cat, { x: () => 2.15 * em(), duration: 0.06, ease: "none" }, at + 0.56);
    tl.to(cat, { x: () => 3.4 * em(), y: () => -1.1 * em(), opacity: 0, duration: 0.24, ease: "sine.in" }, at + 0.62);
  }

  // Legs alternate while it walks — tied to scroll, not a clock.
  // A skew around the hip line swings the feet while the hips stay put.
  const stride = { skewX: 14, svgOrigin: "50 38", duration: 0.035, ease: "sine.inOut", yoyo: true, repeat: 7 };
  tl.fromTo(legsA, { skewX: -14, svgOrigin: "50 38" }, stride, at + 0.34);
  tl.fromTo(legsB, { skewX: 14, svgOrigin: "50 38" }, { ...stride, skewX: -14 }, at + 0.34);
}
