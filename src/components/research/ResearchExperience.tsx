"use client";

import type { ReactNode } from "react";
import { featuredResearch as project } from "@/content/research";
import { enter, exit, markFocus, EASE, TIMING, handover, layout, riseTo } from "@/components/scroll/transitions";
import type { ChapterBuilder } from "@/components/scroll/Journey";
import { cn } from "@/lib/cn";

const FRAME = "flex motion-safe:absolute motion-safe:inset-0 motion-reduce:py-12";
const EYEBROW = "font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-ink-muted uppercase";
// Detail frames sit in the lower part of the stage, beneath the title
// once it has risen into its header position (which, on a phone, is a
// little larger — see buildResearch — so they start a little lower).
const DETAIL = "items-center motion-safe:pt-[22svh] max-md:motion-safe:pt-[26svh] short:motion-safe:pt-[30svh]";

/**
 * An abstract "specimen": a few translucent, cell-like forms. Purely
 * atmospheric — it depicts no data, genes or results, and has no
 * connecting lines. Its layers drift apart slightly with scroll.
 */
function Specimen({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={cn("overflow-visible", className)}>
      <circle data-specimen="outer" cx="200" cy="200" r="170" className="fill-ink/[0.035]" />
      <circle data-specimen="inner" cx="215" cy="190" r="92" className="fill-ink/[0.05]" />
      <circle data-specimen="core" cx="228" cy="182" r="34" className="fill-pink/[0.12]" />
      <circle data-specimen="a" cx="120" cy="268" r="16" className="fill-green/[0.16]" />
      <circle data-specimen="b" cx="300" cy="300" r="9" className="fill-ink/[0.08]" />
      <circle data-specimen="c" cx="92" cy="150" r="6" className="fill-ink/[0.1]" />
    </svg>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-frame data-detail className={cn(FRAME, DETAIL)}>
      <div className="mx-auto w-full max-w-[84rem] px-gutter motion-safe:opacity-0" data-layer="text">
        <p className={EYEBROW}>{label}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

/**
 * The research chapter as an editorial artifact rather than a section:
 * the project's title arrives large beside an abstract specimen, then
 * rises and shrinks into a header (the hero's gesture again) while the
 * project unfolds beneath it one idea at a time — premise, methods,
 * focus, outcome, technologies. All text comes from research.ts.
 */
export function ResearchExperience() {
  const [lead, ...rest] = project.shortTitle.split(" ");

  return (
    <>
      <div data-frame data-research-title className={cn(FRAME, "items-center")}>
        <div className="relative mx-auto w-full max-w-[84rem] px-gutter">
          {/* Centering lives on this wrapper so it never competes with GSAP's transforms on the svg. */}
          <div className="pointer-events-none absolute top-1/2 right-[-18vw] w-[80vw] -translate-y-1/2 sm:right-8 sm:w-[min(40vw,34rem)]">
            <Specimen className="w-full motion-safe:opacity-0" />
          </div>
          <div data-title-block data-layer="title" className="relative origin-left motion-safe:opacity-0">
            <p className={EYEBROW}>Research · {project.kind}</p>
            <h2 className="mt-6 font-display font-semibold text-ink">
              <span className="block text-[min(15vw,3.5rem)] leading-[0.9] sm:text-[clamp(3.5rem,11vw,10.5rem)] short:text-[min(11vw,18svh)]">{lead}</span>
              <span className="mt-3 block max-w-[14ch] text-[clamp(1.75rem,4.2vw,4rem)] leading-[1.02]">
                {rest.join(" ")}
              </span>
            </h2>
          </div>
        </div>
      </div>

      <Detail label="Premise">
        <p className="max-w-4xl font-display text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.12] text-balance text-ink short:text-[clamp(1.25rem,3.6vw,1.75rem)]">
          {project.premise}
        </p>
      </Detail>

      <Detail label="Methods">
        <ol className="flex max-w-3xl flex-col gap-4 sm:gap-5 short:gap-2">
          {project.methods.map((method, i) => (
            <li key={i} data-method className="flex gap-4 font-sans text-base leading-relaxed text-ink sm:gap-5 sm:text-xl short:text-base short:leading-snug">
              <span className="pt-1 font-sans text-[0.6875rem] tracking-[0.16em] text-ink-muted tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{method}</span>
            </li>
          ))}
        </ol>
      </Detail>

      <Detail label="Focus">
        <p className="max-w-3xl font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.15] text-ink">
          {project.focus}
        </p>
      </Detail>

      <Detail label="Outcome">
        <p className="max-w-3xl font-sans text-lg leading-relaxed text-ink sm:text-2xl short:text-lg">
          {project.outcome}
        </p>
      </Detail>

      <Detail label="Technologies">
        <ul className="flex max-w-4xl flex-wrap gap-x-8 gap-y-3">
          {project.technologies.map((tech) => (
            <li key={tech} data-tech className="font-display text-[clamp(1.5rem,3vw,2.75rem)] leading-tight text-ink">
              {tech}
            </li>
          ))}
        </ul>
      </Detail>
    </>
  );
}

/**
 * Title + specimen arrive together (the specimen a touch nearer), hold,
 * then the title rises and shrinks into a header while the first detail
 * enters beneath it. Details then hand over one to the next; methods and
 * technologies arrive item by item. Finally the header and specimen
 * leave with the last detail.
 */
export const buildResearch: ChapterBuilder = (tl, at, chapter) => {
  const titleFrame = chapter.querySelector<HTMLElement>("[data-research-title]");
  const block = chapter.querySelector<HTMLElement>("[data-title-block]");
  const specimen = chapter.querySelector("svg");
  const details = Array.from(chapter.querySelectorAll<HTMLElement>("[data-detail]"));
  if (!block) return at;

  let t = at;
  enter(tl, block, t, { duration: 0.8 });
  enter(tl, specimen, t, { duration: 1, depth: 1.8, scale: 0.85 });
  markFocus(titleFrame, t + 0.8);
  t += 0.8 + TIMING.hold + 0.1;

  // Title becomes the chapter's header; the specimen drifts back. On a
  // phone the title starts much smaller, so it shrinks less — at 0.42
  // its eyebrow would be ~5px. A landscape phone has no height to spare.
  const header = layout.short ? 0.5 : layout.compact ? 0.62 : 0.42;
  const risen = riseTo(block, header);
  tl.to(block, { scale: header, y: risen, duration: 0.8, ease: EASE }, t);
  tl.to(specimen, { scale: 0.7, y: () => -0.18 * window.innerHeight, opacity: 0.45, duration: 1.2, ease: EASE }, t);
  // Inner forms separate slightly over the course of the chapter.
  const forms = chapter.querySelectorAll("[data-specimen='core'], [data-specimen='a'], [data-specimen='c']");
  tl.to(forms, { x: (i) => [18, -26, -14][i], y: (i) => [-10, 22, -18][i], duration: 4, ease: "none" }, t);

  t += 0.2;
  details.forEach((detail, i) => {
    const text = detail.querySelector("[data-layer='text']");
    const items = detail.querySelectorAll("[data-method], [data-tech]");
    const last = i === details.length - 1;

    enter(tl, text, t);
    let settled = t + TIMING.enter;
    if (items.length) {
      items.forEach((item, j) => enter(tl, item, t + 0.25 + j * 0.14, { duration: 0.5, scale: 1 }));
      settled = t + 0.25 + (items.length - 1) * 0.14 + 0.5;
    }
    markFocus(detail, settled);

    const leave = settled + (last ? TIMING.hold + 0.2 : TIMING.hold);
    exit(tl, text, leave);
    if (last) {
      // Continue upward from the header position rather than the default exit target.
      tl.to(block, { y: () => risen() - 0.14 * window.innerHeight, scale: header * 0.86, opacity: 0, duration: TIMING.exit, ease: EASE }, leave);
      tl.to(specimen, { y: () => -0.4 * window.innerHeight, scale: 0.6, opacity: 0, duration: TIMING.exit, ease: EASE }, leave);
    }
    t = last ? leave : leave + handover();
  });

  return t;
};
