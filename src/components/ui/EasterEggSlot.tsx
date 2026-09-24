import { cn } from "@/lib/cn";

/**
 * A reserved, currently-empty mark in the footer.
 *
 * This is a placeholder anchor for a future subtle cat easter egg —
 * intentionally undecorated for now. Do not put a cat here yet; when
 * one is added, it should stay this small and this quiet.
 */
export function EasterEggSlot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-3 w-3 rounded-full border border-line-strong/70",
        className
      )}
    />
  );
}
