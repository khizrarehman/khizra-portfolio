/**
 * Creative and design work.
 *
 * Intentionally empty: no creative projects have been provided yet, and
 * none should be invented. The type is flexible enough for visual work,
 * design, writing collections or anything mixed — add entries as Khizra
 * shares them.
 */

export type CreativeMedium =
  | "design"
  | "illustration"
  | "photography"
  | "writing"
  | "mixed"
  | (string & {});

export type CreativeMedia = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type CreativeWork = {
  slug: string;
  title: string;
  medium: CreativeMedium;
  /** A line or two in her own words. */
  description?: string;
  /** Free-form, e.g. "2026" or "Spring 2026". */
  date?: string;
  media?: CreativeMedia[];
  /** External home for the piece, if it lives elsewhere. */
  url?: string;
  tags?: string[];
  featured?: boolean;
};

export const creativeWork: CreativeWork[] = [];
