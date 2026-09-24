import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A small uppercase, tracked, monospace label — used for eyebrows,
 * specimen-style annotations, and metadata (e.g. "01 — RESEARCH", "TK").
 *
 * Color is a deliberate signal, not decoration: "green" marks routine
 * scientific/data annotation, "pink" is reserved for personal or
 * interactive moments — use it sparingly.
 */
export function Tag({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "pink" | "green";
  className?: string;
}) {
  const colors = {
    default: "text-ink-muted",
    pink: "text-pink",
    green: "text-green",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase",
        colors[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
