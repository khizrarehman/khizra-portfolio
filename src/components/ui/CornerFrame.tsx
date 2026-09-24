import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Museum/specimen-label corner brackets, wrapped around a block —
 * part of the site's scientific visual language.
 */
export function CornerFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute -top-px -left-px h-5 w-5 border-t border-l border-ink/50" />
      <span className="pointer-events-none absolute -top-px -right-px h-5 w-5 border-t border-r border-ink/50" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-5 w-5 border-b border-l border-ink/50" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 border-b border-r border-ink/50" />
      {children}
    </div>
  );
}
