import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { aboutPreview } from "@/content/home";

export function AboutPreview() {
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-8 border-t border-line pt-10 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="flex flex-col gap-4">
          <Tag>{aboutPreview.eyebrow}</Tag>
          <p className="max-w-2xl font-serif text-2xl leading-snug text-ink italic sm:text-3xl">
            {aboutPreview.paragraph}
          </p>
        </div>
        <Button href={aboutPreview.href} variant="secondary" className="shrink-0">
          {aboutPreview.linkLabel}
        </Button>
      </Container>
    </section>
  );
}
