"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { goToChapter } from "@/components/motion/chapters";
import type { ChapterId } from "@/components/motion/chapters";

/**
 * A link to a homepage chapter. On the homepage it travels smoothly
 * through the journey (see Journey) instead of jumping; anywhere else
 * it's an ordinary link to /#chapter, which Journey honours on load.
 */
export function ChapterLink({
  chapter,
  className,
  onNavigate,
  children,
}: {
  chapter: ChapterId;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  const href = chapter === "hero" ? "/" : `/#${chapter}`;
  return (
    <Link
      href={href}
      // Arriving from another page, the journey travels to the hash itself
      // once it's built (Journey); the router's own scroll-to-hash would
      // race it and land on the section's static position (the top).
      scroll={false}
      className={className}
      onClick={(event) => {
        onNavigate?.();
        if (goToChapter(chapter)) {
          event.preventDefault();
          history.replaceState(null, "", href);
        }
      }}
    >
      {children}
    </Link>
  );
}
