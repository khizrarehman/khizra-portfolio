/**
 * Experience, told as short narratives rather than CV bullets.
 * Source of truth: Khizra's CV ("Experience").
 */

export type Experience = {
  role: string;
  organization: string;
  /** Where within the organization, when the CV gives it. */
  unit?: string;
  period: string;
  duration?: string;
  narrative: string;
  /** Short topic labels drawn from the CV bullets. */
  topics: string[];
};

export const experience: Experience[] = [
  {
    role: "Bioinformatics Trainee",
    organization: "BCD Training Workshop",
    period: "2025",
    duration: "1 month",
    narrative:
      "A month of hands-on training in next-generation sequencing: taking high-throughput data through quality control, alignment and variant analysis to visualisation, with the toolchains used across research and industry genomics.",
    topics: ["NGS workflows", "Quality control", "Alignment", "Variant analysis", "Visualisation"],
  },
  {
    role: "Member — Social Media & Event Coordination",
    organization: "IEEE",
    unit: "School of Engineering Sciences and Technology, Jamia Hamdard University",
    period: "2023 – 2025",
    narrative:
      "Shaped the social media and content behind the school's academic and technical initiatives, and organised and hosted TechNZova, a technical event — outreach, logistics and the people in the room, start to finish.",
    topics: ["Social media & content", "Event organisation", "Outreach"],
  },
];
