import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  narrow = false,
}: {
  children: ReactNode;
  className?: string;
  /** Constrain to a reading-width measure, for editorial text blocks. */
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        narrow ? "max-w-[42rem]" : "max-w-[84rem]",
        className
      )}
    >
      {children}
    </div>
  );
}
