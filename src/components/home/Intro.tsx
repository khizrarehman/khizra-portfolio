import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { SignatureDot } from "@/components/ui/SignatureDot";
import { intro } from "@/content/home";

export function Intro() {
  return (
    <section className="border-y border-line py-14 sm:py-16">
      <Container className="grid gap-4 sm:grid-cols-[8rem_1fr] sm:gap-8">
        <div className="flex items-center gap-2.5">
          <SignatureDot />
          <Tag>{intro.label}</Tag>
        </div>
        <p className="max-w-[42rem] font-serif text-xl leading-relaxed text-ink sm:text-2xl">
          {intro.paragraph}
        </p>
      </Container>
    </section>
  );
}
