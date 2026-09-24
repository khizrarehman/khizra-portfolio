import { cn } from "@/lib/cn";

/**
 * A small recurring pink mark — the site's one personal "signature".
 * Used sparingly, next to a handful of personal moments (the wordmark,
 * the intro note, the hero specimen point) rather than as general decoration.
 */
export function SignatureDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-pink", className)}
    />
  );
}
