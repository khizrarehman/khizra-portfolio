"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SignatureDot } from "@/components/ui/SignatureDot";
import { profile } from "@/content/profile";
import { ChapterLink } from "@/components/layout/ChapterLink";
import { NAV_LINKS } from "@/components/layout/navLinks";
import { cn } from "@/lib/cn";

/**
 * Deliberately quiet: no bar, no background — just the name and four
 * words floating at the top of the space. On the homepage, links travel
 * smoothly through the journey to their chapter (see Journey); from any
 * other page they're ordinary links to /#chapter.
 *
 * Below `sm` the four links move into a small menu, which overlays the
 * page (it never pushes the hero down) and closes on Escape, on choosing
 * a link, or when the viewport grows past the breakpoint.
 */
export function Navigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 40rem)");
    const onWide = () => wide.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const linkClass = "font-sans text-[0.8125rem] tracking-wide text-ink-muted transition-colors hover:text-ink";

  return (
    // With reduced motion the page is an ordinary scrolling document, so
    // text passes beneath the nav; a soft paper wash keeps the links legible.
    <header className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] motion-reduce:bg-paper/85 motion-reduce:backdrop-blur-sm">
      <Container>
        <nav className="flex h-[var(--nav-h)] items-center justify-between">
          <ChapterLink
            chapter="hero"
            onNavigate={() => setOpen(false)}
            className="-my-2 flex items-center gap-2.5 py-2 font-sans text-[0.75rem] font-medium tracking-[0.18em] text-ink uppercase"
          >
            <SignatureDot />
            {profile.name}
          </ChapterLink>

          <ul className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.chapter}>
                <ChapterLink chapter={link.chapter} className={linkClass}>
                  {link.label}
                </ChapterLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            aria-controls="mobile-menu"
            // 44px tap target; the negative margin keeps the icon aligned to the gutter.
            className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-1.5 sm:hidden"
          >
            <span className={cn("h-px w-5 bg-ink transition-transform", open && "translate-y-[3.5px] rotate-45")} />
            <span className={cn("h-px w-5 bg-ink transition-transform", open && "-translate-y-[3.5px] -rotate-45")} />
          </button>
        </nav>
      </Container>

      {open ? (
        <div id="mobile-menu" className="absolute inset-x-0 top-full bg-paper/95 backdrop-blur-sm sm:hidden">
          <Container>
            <ul className="flex flex-col pb-3">
              {NAV_LINKS.map((link) => (
                <li key={link.chapter}>
                  <ChapterLink
                    chapter={link.chapter}
                    onNavigate={() => setOpen(false)}
                    className={cn(linkClass, "block py-3 text-sm")}
                  >
                    {link.label}
                  </ChapterLink>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
