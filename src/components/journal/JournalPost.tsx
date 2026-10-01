import Image from "next/image";
import type { JournalPost as Post } from "@/content/journal";
import { cn } from "@/lib/cn";

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * One Substack post as an editorial object floating in the space:
 * typography first, the cover image (when there is one) as a second,
 * nearer layer. No card, border or shadow.
 *
 * The whole post is a single link to the real Substack URL, opening in
 * a new tab. On hover the post gently grows (title ~1.04, image ~1.05)
 * while everything else on the stage recedes (globals.css). Touch
 * screens have no hover, so there the same growth is the press feedback
 * of a tap (group-active), just before the post opens. Keyboard focus
 * recedes the stage too, but keeps the post still, so the focus ring
 * (globals.css) stays drawn cleanly around it.
 *
 * Composition: side by side from `sm`; on phones the cover sits above
 * the text, sized by both width and height so one post always fits the
 * visible screen with its title and excerpt at full reading size.
 *
 * `data-layer` elements are what the journey animates — media and text
 * move at slightly different depths, so each post arrives as layers
 * rather than a flat block. The hover scale lives on inner wrappers so
 * it never fights the scroll transforms.
 */
export function JournalPost({ post, index }: { post: Post; index: number }) {
  const flip = index % 2 === 1;
  const date = dateFormat.format(new Date(post.publishedAt));

  return (
    <article
      data-frame
      className="flex items-center motion-safe:absolute motion-safe:inset-0 motion-reduce:py-16"
    >
      <div className="mx-auto w-full max-w-[84rem] px-gutter">
        <a
          data-post
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group flex w-fit max-w-full cursor-pointer flex-col gap-7 [--focus-offset:12px] sm:items-center sm:gap-16 short:gap-10",
            post.image ? (flip ? "sm:flex-row-reverse" : "sm:flex-row") : "",
            !post.image && flip && "sm:ml-auto"
          )}
        >
          {post.image ? (
            <div data-layer="media" className="shrink-0 motion-safe:opacity-0">
              <div className="relative aspect-[4/5] w-[min(60vw,32svh)] transition-transform duration-700 ease-out group-hover:scale-[1.05] group-active:scale-[1.05] group-active:duration-300 sm:w-[min(clamp(13rem,24vw,24rem),52svh)]">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) min(24vw, 384px), 60vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div data-layer="text" className="max-w-3xl motion-safe:opacity-0">
            <div
              className={cn(
                "flex flex-col gap-4 transition-transform duration-700 ease-out group-hover:scale-[1.04] group-active:scale-[1.04] group-active:duration-300 sm:gap-5",
                flip && post.image ? "origin-right" : "origin-left"
              )}
            >
              <p className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase">
                <time dateTime={post.publishedAt}>{date}</time>
                <span aria-hidden> · </span>
                Substack
                <span aria-hidden className="ml-1.5 inline-block transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </p>
              <h3 className="font-display text-[clamp(2.25rem,5.2vw,5.25rem)] leading-[1.02] font-semibold text-balance break-words text-ink short:text-[clamp(1.75rem,5.2vw,2.5rem)]">
                {post.title}
              </h3>
              {post.excerpt ? (
                <p className="max-w-xl font-sans text-base leading-relaxed text-ink-muted sm:text-xl short:text-base">
                  {post.excerpt}
                </p>
              ) : null}
            </div>
          </div>
        </a>
      </div>
    </article>
  );
}
