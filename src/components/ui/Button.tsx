import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center gap-2 font-sans text-sm font-medium tracking-wide transition-colors duration-150";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full bg-pink px-5 py-2.5 text-paper hover:bg-pink-deep",
  secondary:
    "rounded-full border border-ink px-5 py-2.5 text-ink hover:border-pink hover:text-pink",
  ghost:
    "text-ink underline decoration-line underline-offset-4 hover:text-pink hover:decoration-pink",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export function Button({
  children,
  variant = "primary",
  className,
  href,
  ...rest
}: ButtonAsLink | ButtonAsButton) {
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
