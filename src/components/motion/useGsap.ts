"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/**
 * Shared entry point for GSAP work — section transitions, text reveals,
 * parallax, continuous cross-section transforms, etc. should all set
 * themselves up through this hook rather than calling gsap directly, so
 * cleanup stays consistent everywhere.
 *
 * `setup` runs inside a scoped gsap.context(): every tween and
 * ScrollTrigger it creates (including selector-scoped queries when a
 * `scope` element is passed) is tracked and automatically reverted on
 * unmount or when `deps` change.
 */
export function useGsap(
  setup: () => void,
  scope?: RefObject<Element | null>,
  deps: unknown[] = []
) {
  useEffect(() => {
    const ctx = gsap.context(setup, scope?.current ?? undefined);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
