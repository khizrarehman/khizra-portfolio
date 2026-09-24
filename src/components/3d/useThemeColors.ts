"use client";

import { useMemo } from "react";

/**
 * Reads the site's CSS color tokens at runtime so the 3D scene always
 * matches the design system in globals.css instead of duplicating hex
 * values. Client-only (this whole 3d/ subtree is loaded with ssr:false).
 */
const FALLBACK = {
  ink: "#1b1712",
  inkMuted: "#6b6255",
  pink: "#b8305f",
  green: "#5f7a55",
  paper: "#faf7f1",
  line: "#ded4c4",
};

function readVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

export function useThemeColors() {
  return useMemo(
    () => ({
      ink: readVar("--color-ink", FALLBACK.ink),
      inkMuted: readVar("--color-ink-muted", FALLBACK.inkMuted),
      pink: readVar("--color-pink", FALLBACK.pink),
      green: readVar("--color-green", FALLBACK.green),
      paper: readVar("--color-paper", FALLBACK.paper),
      line: readVar("--color-line", FALLBACK.line),
    }),
    []
  );
}
