import type { ChapterId } from "@/components/motion/chapters";
import { creativeWork } from "@/content/creative";

const ALL_LINKS: { chapter: ChapterId; label: string }[] = [
  { chapter: "substack", label: "Substack" },
  { chapter: "research", label: "Research" },
  { chapter: "archive", label: "Archive" },
  { chapter: "about", label: "About" },
];

/**
 * The site's destinations — homepage chapters, reachable as /#id. The
 * archive is only a destination once it holds work (see ArchiveChapter);
 * until then it's an interlude you pass through, not a place to go.
 */
export const NAV_LINKS = ALL_LINKS.filter((link) => link.chapter !== "archive" || creativeWork.length > 0);
