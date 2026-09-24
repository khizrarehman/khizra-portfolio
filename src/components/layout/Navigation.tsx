"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SignatureDot } from "@/components/ui/SignatureDot";
import { cn } from "@/lib/cn";

const links = [
  { href: "/research", label: "Research" },
  { href: "/journal", label: "Journal" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-sans text-sm font-semibold tracking-[0.16em] text-ink uppercase"
            onClick={() => setOpen(false)}
          >
            <SignatureDot />
            Khizra Rehman
          </Link>

          <ul className="hidden items-center gap-8 sm:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-sm tracking-wide text-ink-muted transition-colors hover:text-pink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
          >
            <span
              className={cn(
                "h-px w-5 bg-ink transition-transform",
                open && "translate-y-[3.5px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-5 bg-ink transition-transform",
                open && "-translate-y-[3.5px] -rotate-45"
              )}
            />
          </button>
        </nav>
      </Container>

      {open ? (
        <div className="border-t border-line sm:hidden">
          <Container>
            <ul className="flex flex-col py-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-sans text-sm tracking-wide text-ink-muted hover:text-pink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
