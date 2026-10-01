/**
 * Education. Source of truth: Khizra's CV ("Education").
 * The CV names no institution for the B.Sc., so none is given here.
 */

export type Education = {
  degree: string;
  field: string;
  institution?: string;
  location?: string;
  period: string;
};

export const education: Education[] = [
  {
    degree: "M.Sc.",
    field: "Computational Biology, Systems Biology & Bioinformatics",
    institution: "Jamia Hamdard University",
    location: "New Delhi",
    period: "2023 – 2025",
  },
  {
    degree: "B.Sc. (Hons)",
    field: "Botany",
    period: "2020 – 2023",
  },
];
