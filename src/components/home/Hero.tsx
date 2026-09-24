import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { SignatureDot } from "@/components/ui/SignatureDot";
import { HeroScene } from "@/components/3d/HeroScene";
import { hero } from "@/content/home";

export function Hero() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <SignatureDot />
            <Tag>{hero.eyebrow}</Tag>
          </div>
          <h1 className="font-serif text-5xl leading-[1.05] text-ink italic sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="max-w-md font-sans text-base text-ink-muted sm:text-lg">
            {hero.subheadline}
          </p>
        </div>

        {/*
          The hero's interactive 3D environment. The scientific grid stays
          as the backdrop behind it; the canvas itself is transparent.
        */}
        <CornerFrame className="bg-lab-grid aspect-[4/3] w-full overflow-hidden border border-line">
          <div className="pointer-events-none absolute top-4 left-4 z-10">
            <Tag>Fig. 01</Tag>
          </div>
          <div className="absolute inset-0">
            <HeroScene />
          </div>
          <div className="pointer-events-none absolute right-4 bottom-4 z-10 text-right">
            <Tag>Live environment</Tag>
          </div>
        </CornerFrame>
      </Container>
    </section>
  );
}
