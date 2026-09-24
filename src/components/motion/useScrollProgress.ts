"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";

/**
 * Reactive 0–1 scroll progress for the whole page, sourced from the root
 * Lenis instance set up by SmoothScroll. Not used anywhere yet — this is
 * infrastructure for future work: a progress indicator, section
 * transitions, parallax, or driving a 3D camera from scroll position.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useLenis((lenis) => {
    setProgress(lenis.progress);
  });

  return progress;
}
