"use client";

import { Journey } from "@/components/scroll/Journey";
import type { JourneyChapter } from "@/components/scroll/Journey";
import { Hero, buildHero } from "@/components/home/Hero";
import { JournalExperience, buildJournal } from "@/components/journal/JournalExperience";
import { ResearchExperience, buildResearch } from "@/components/research/ResearchExperience";
import { ArchiveChapter, buildArchive } from "@/components/archive/ArchiveChapter";
import { ExperienceChapter, buildExperience } from "@/components/home/ExperienceChapter";
import { EducationChapter, buildEducation } from "@/components/home/EducationChapter";
import { AboutChapter, buildAbout } from "@/components/home/AboutChapter";
import { PawTrail } from "@/components/home/PawTrail";

/**
 * The homepage as one journey. Order here is the order of the
 * experience, and must match CHAPTER_IDS (the 3D camera's stations).
 */
const chapters: JourneyChapter[] = [
  { id: "hero", label: "Khizra Rehman", build: buildHero, content: <Hero /> },
  { id: "substack", label: "Substack", build: buildJournal, content: <JournalExperience /> },
  { id: "research", label: "Research", build: buildResearch, content: <ResearchExperience /> },
  { id: "archive", label: "Creative archive", build: buildArchive, content: <ArchiveChapter /> },
  { id: "experience", label: "Experience", build: buildExperience, content: <ExperienceChapter /> },
  { id: "education", label: "Education", build: buildEducation, content: <EducationChapter /> },
  { id: "about", label: "About", build: buildAbout, content: <AboutChapter /> },
];

export function HomeJourney() {
  return (
    <div className="relative">
      <Journey chapters={chapters} />
      <PawTrail />
    </div>
  );
}
