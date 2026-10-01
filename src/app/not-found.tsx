import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
};

/** The site's 404: the same quiet editorial voice, and a way home. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] w-full max-w-[84rem] flex-col justify-center px-gutter py-24">
      <p className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase">404</p>
      <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,6rem)] leading-none font-semibold text-ink">
        Nothing here.
      </h1>
      <p className="mt-8 max-w-xl font-sans text-lg text-ink-muted">This page doesn&rsquo;t exist.</p>
      <Link
        href="/"
        className="mt-10 inline-block self-start py-2 font-sans text-sm tracking-wide text-ink underline decoration-line underline-offset-4 transition-colors hover:text-pink hover:decoration-pink"
      >
        Back to the beginning
      </Link>
    </div>
  );
}
