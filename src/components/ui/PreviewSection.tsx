import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";

export type PreviewItem = {
  index: string;
  title: string;
  excerpt: string;
  meta: string;
};

/**
 * Shared card-grid layout used by the Research, Journal, and Archive
 * homepage previews — each section supplies its own eyebrow/copy/items.
 */
export function PreviewSection({
  eyebrow,
  title,
  description,
  items,
  viewAllHref,
  viewAllLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: PreviewItem[];
  viewAllHref: string;
  viewAllLabel: string;
}) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          viewAllHref={viewAllHref}
          viewAllLabel={viewAllLabel}
        />
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.index}
              className="flex flex-col gap-3 border-t border-line pt-5"
            >
              <div className="flex items-center justify-between">
                <Tag>{item.index}</Tag>
                <Tag variant="green">{item.meta}</Tag>
              </div>
              <h3 className="font-serif text-xl text-ink">{item.title}</h3>
              <p className="text-sm text-ink-muted">{item.excerpt}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
