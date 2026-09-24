"use client";

import { useScrollProgress } from "@/components/motion/useScrollProgress";
import { cn } from "@/lib/cn";

/**
 * A thin fixed bar tracking page scroll progress. Reusable, but not
 * mounted anywhere yet — available for whenever a page wants a visible
 * scroll indicator.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none fixed top-0 left-0 z-50 h-px w-full bg-line", className)}
    >
      <div
        className="h-full origin-left bg-pink"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
