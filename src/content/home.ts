/**
 * Homepage framing copy, composed from the content layer. This file owns
 * only framing (eyebrows, titles, linking lines); every fact comes from
 * profile / research / journal / creative.
 */
import { profile } from "@/content/profile";

export const hero = {
  headline: profile.name,
  subheadline: profile.tagline,
};

export const archive = {
  eyebrow: "Creative archive",
  title: "Creative Archive",
  description: "Design and visual work — gathered here as it takes shape.",
  /**
   * Shown while creative.ts is empty: a line about the space itself — it
   * makes no claim about work that hasn't been added.
   */
  interlude: "Kept open for the things that don’t fit in a CV.",
};
