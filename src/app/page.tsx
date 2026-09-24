import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { ResearchPreview } from "@/components/research/ResearchPreview";
import { JournalPreview } from "@/components/journal/JournalPreview";
import { ArchivePreview } from "@/components/archive/ArchivePreview";
import { AboutPreview } from "@/components/home/AboutPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <ResearchPreview />
      <JournalPreview />
      <ArchivePreview />
      <AboutPreview />
    </>
  );
}
