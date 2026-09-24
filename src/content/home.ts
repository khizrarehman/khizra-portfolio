/**
 * Temporary, neutral placeholder content for the homepage.
 * Nothing here is a fact about Khizra — replace before launch.
 */
import type { PreviewItem } from "@/components/ui/PreviewSection";

export const hero = {
  eyebrow: "INDEX",
  headline: "Khizra Rehman",
  subheadline:
    "Research notes, essays, and creative work — gathered here as they take shape.",
};

export const intro = {
  label: "NOTE —",
  paragraph:
    "Placeholder introduction. A short note on focus and approach will go here, in Khizra's own words.",
};

export const researchPreview: {
  eyebrow: string;
  title: string;
  description: string;
  viewAllHref: string;
  viewAllLabel: string;
  items: PreviewItem[];
} = {
  eyebrow: "01 — RESEARCH",
  title: "Research",
  description: "Placeholder description of ongoing research interests and projects.",
  viewAllHref: "/research",
  viewAllLabel: "View all research",
  items: [
    { index: "01", title: "Working title", excerpt: "Placeholder excerpt for a research project or paper.", meta: "TK" },
    { index: "02", title: "Working title", excerpt: "Placeholder excerpt for a research project or paper.", meta: "TK" },
    { index: "03", title: "Working title", excerpt: "Placeholder excerpt for a research project or paper.", meta: "TK" },
  ],
};

export const journalPreview: typeof researchPreview = {
  eyebrow: "02 — JOURNAL",
  title: "Journal",
  description: "Placeholder description of essays and journal entries.",
  viewAllHref: "/journal",
  viewAllLabel: "View all entries",
  items: [
    { index: "01", title: "Placeholder entry title", excerpt: "Placeholder excerpt for a journal entry.", meta: "TK" },
    { index: "02", title: "Placeholder entry title", excerpt: "Placeholder excerpt for a journal entry.", meta: "TK" },
    { index: "03", title: "Placeholder entry title", excerpt: "Placeholder excerpt for a journal entry.", meta: "TK" },
  ],
};

export const archivePreview: typeof researchPreview = {
  eyebrow: "03 — ARCHIVE",
  title: "Creative Archive",
  description: "Placeholder description of creative and visual work.",
  viewAllHref: "/archive",
  viewAllLabel: "View the archive",
  items: [
    { index: "01", title: "Placeholder piece", excerpt: "Placeholder caption for an archived piece.", meta: "TK" },
    { index: "02", title: "Placeholder piece", excerpt: "Placeholder caption for an archived piece.", meta: "TK" },
    { index: "03", title: "Placeholder piece", excerpt: "Placeholder caption for an archived piece.", meta: "TK" },
  ],
};

export const aboutPreview = {
  eyebrow: "04 — ABOUT",
  title: "About",
  paragraph:
    "Placeholder paragraph introducing Khizra — background, interests, and current focus will go here.",
  href: "/about",
  linkLabel: "Read more",
};
