/**
 * Khizra's writing, published on Substack.
 *
 * `journalSnapshot` is a hand-copied snapshot of real posts from her
 * publication (see `retrievedAt`) — titles, opening lines, dates, URLs
 * and cover images exactly as published, with like counts as they stood
 * on that date. Nothing here is invented.
 *
 * The site reads posts only through `getJournalPosts()`, so swapping the
 * snapshot for live data later (the publication's RSS feed or archive
 * API, below) is a change to that one function.
 */

export type JournalPost = {
  title: string;
  /** Substack subtitle, or the post's opening line when it has none. */
  excerpt?: string;
  /** ISO 8601. */
  publishedAt: string;
  url: string;
  image?: string;
  /** Likes at the time the data was retrieved. */
  likes?: number;
  /** One of her top posts on Substack. */
  featured?: boolean;
};

export type JournalSource = {
  publication: string;
  author: string;
  bio: string;
  url: string;
  profileUrl: string;
  /** Live-data endpoints for later integration. */
  feedUrl: string;
  archiveApiUrl: string;
};

export const substack: JournalSource = {
  publication: "k.’s Substack",
  author: "khizra / خضرا",
  bio: "a journal left open by accident.",
  url: "https://kworld.substack.com",
  profileUrl: "https://substack.com/@khizrarehman",
  feedUrl: "https://kworld.substack.com/feed",
  archiveApiUrl: "https://kworld.substack.com/api/v1/archive",
};

const CDN = "https://substackcdn.com/image/fetch/$s_!";
const MEDIA = "f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F";

export const journalSnapshot: { retrievedAt: string; posts: JournalPost[] } = {
  retrievedAt: "2026-09-25",
  posts: [
    // Top posts, by likes.
    {
      title: "anxious attachment and avoidant relationships",
      excerpt: "so people with anxious attachment and avoidance often lie differently.",
      publishedAt: "2025-10-01",
      url: "https://kworld.substack.com/p/anxious-attachment-and-avoidant-relationships",
      image: `${CDN}jwfY!,${MEDIA}1bcfd1f9-0791-4634-9820-82f47ab56703_736x717.jpeg`,
      likes: 366,
      featured: true,
    },
    {
      title: "But who am I without my sensitive heart",
      excerpt: "Some mornings I wake up already tired, even when my body should feel rested.",
      publishedAt: "2025-12-30",
      url: "https://kworld.substack.com/p/but-who-am-i-without-my-sensitive",
      image: `${CDN}O5eG!,${MEDIA}edb7a92c-4056-4776-b314-5dadb47f331e_1200x1600.jpeg`,
      likes: 33,
      featured: true,
    },
    {
      title: "The Road That Leads Back",
      excerpt:
        "how strange it is to leave the place that built you, only to start calling another your home.",
      publishedAt: "2025-11-09",
      url: "https://kworld.substack.com/p/the-road-that-leads-back",
      image: `${CDN}3XUm!,${MEDIA}ba9cfb98-0474-499a-baa2-d941d5f84688_720x1280.jpeg`,
      likes: 23,
      featured: true,
    },
    {
      title: "a room inside me",
      excerpt: "sometimes the strangest part is that nothing is wrong.",
      publishedAt: "2025-12-26",
      url: "https://kworld.substack.com/p/a-room-inside-me",
      image: `${CDN}VFZe!,${MEDIA}9684887c-804c-4b79-ac1a-30a4c4a92422_1200x1600.jpeg`,
      likes: 23,
      featured: true,
    },
    {
      title: "apparently , i’m still figuring it out",
      publishedAt: "2026-08-13",
      url: "https://kworld.substack.com/p/apparently-im-still-figuring-it-out",
      image: `${CDN}sT-S!,${MEDIA}f67f381c-dd65-4089-9067-d65e399a1809_1106x1200.jpeg`,
      likes: 17,
      featured: true,
    },
    {
      title: "just live 🦦",
      excerpt: "we humans think too much.",
      publishedAt: "2025-09-21",
      url: "https://kworld.substack.com/p/just-live",
      image: `${CDN}ccCq!,${MEDIA}57b21a90-d9b6-4217-9c35-4b4d55a1ae16_4032x3024.jpeg`,
      likes: 16,
      featured: true,
    },

    // Most recent posts.
    {
      title: "coco",
      excerpt: "26th",
      publishedAt: "2026-09-21",
      url: "https://kworld.substack.com/p/coco",
      image: `${CDN}XEOv!,${MEDIA}4d51dd51-5bb2-45ad-8743-99ac4e3c1bbf_5712x4284.jpeg`,
      likes: 2,
    },
    {
      title: "the adulthood arc",
      excerpt: "today, while going for a walk, i saw a few children playing outside.",
      publishedAt: "2026-09-19",
      url: "https://kworld.substack.com/p/the-adulthood-arc",
      likes: 3,
    },
    {
      title: "writing anyway",
      excerpt: "I’ve been feeling lost, in fact, ever since I graduated.",
      publishedAt: "2026-09-16",
      url: "https://kworld.substack.com/p/writing-anyway",
      likes: 8,
    },
    {
      title: "my definition of chic",
      excerpt: "my very subjective list of things i find effortlessly chic",
      publishedAt: "2026-09-11",
      url: "https://kworld.substack.com/p/my-definition-of-chic",
      image: `${CDN}ttr_!,${MEDIA}cf9bd364-6057-41e7-b5a9-85c5c6bdb099_1200x1582.jpeg`,
      likes: 14,
    },
    {
      title: "the ache",
      excerpt:
        "There is a particular kind of guilt that comes with not getting something I genuinely wanted.",
      publishedAt: "2026-08-28",
      url: "https://kworld.substack.com/p/the-ache",
      image: `${CDN}JJd9!,${MEDIA}42d24b08-7a41-4b77-b946-b44d833e3635_500x464.jpeg`,
      likes: 10,
    },
  ],
};

/** All posts, newest first. The single seam for live data later. */
export function getJournalPosts(): JournalPost[] {
  return [...journalSnapshot.posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Top posts, most-liked first. */
export function getFeaturedPosts(limit?: number): JournalPost[] {
  const featured = getJournalPosts()
    .filter((post) => post.featured)
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  return limit === undefined ? featured : featured.slice(0, limit);
}
