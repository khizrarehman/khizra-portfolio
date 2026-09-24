import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3">
        <Tag>{eyebrow}</Tag>
        <h2 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h2>
        {description ? (
          <p className="max-w-lg text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {viewAllHref ? (
        <Button href={viewAllHref} variant="ghost" className="shrink-0">
          {viewAllLabel ?? "View all"} →
        </Button>
      ) : null}
    </div>
  );
}
