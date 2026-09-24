"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/components/motion/useGsap";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

/**
 * Drives the root Lenis instance from GSAP's ticker (instead of Lenis's
 * own rAF loop) and tells ScrollTrigger to recalculate on every Lenis
 * scroll frame. This is what keeps ScrollTrigger-driven animations from
 * lagging a frame behind the smoothed scroll position.
 */
function LenisScrollTriggerBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const updateScrollTrigger = () => ScrollTrigger.update();
    lenis.on("scroll", updateScrollTrigger);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(tick);
    };
  }, [lenis]);

  return null;
}

/**
 * Global smooth-scroll setup for the whole app — wrap the page content
 * with this once, in the root layout.
 *
 * Uses Lenis in `root` mode, which drives window/document scroll
 * directly rather than introducing a transform-based wrapper, so it
 * needs no extra DOM and existing layout (sticky nav, etc.) is
 * unaffected. Falls back to plain native scrolling — no Lenis, no GSAP
 * ticker wiring — when the user has requested reduced motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ autoRaf: false, lerp: 0.1, wheelMultiplier: 1 }}>
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  );
}
