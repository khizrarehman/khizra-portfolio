"use client";

import { useSyncExternalStore } from "react";

// Phones in either orientation: narrow, or short (landscape).
const QUERY = "(max-width: 767px), (max-height: 500px)";

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/** Tracks whether the viewport is phone-sized, portrait or landscape. */
export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
