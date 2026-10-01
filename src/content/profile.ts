/**
 * Who Khizra is, in the site's own voice.
 *
 * Source of truth: Khizra's CV (professional/academic facts) and her
 * Substack profile (writing). Copy here is an editorial rewrite, not the
 * CV verbatim — keep every factual claim traceable to one of those two
 * sources, and don't add achievements, metrics or skills that aren't in
 * them.
 */

export type SkillGroup = {
  label: string;
  skills: string[];
};

export type ProfileLink = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  /** How she signs her writing on Substack. */
  penName: string;
  degree: string;
  /** The fields she works across, most central first. */
  focus: string[];
  /** One line under the name. */
  tagline: string;
  /** The short editorial introduction (rewritten from her CV summary). */
  intro: string;
  /** A slightly fuller "about" paragraph. */
  about: string;
  skillGroups: SkillGroup[];
  links: ProfileLink[];
};

export const profile: Profile = {
  name: "Khizra Rehman",
  penName: "khizra / خضرا",
  degree: "M.Sc. Computational Biology, Systems Biology & Bioinformatics",
  focus: ["Bioinformatics", "Genomics", "NGS", "Python & R", "Machine learning"],

  tagline: "doing science & overthinking everything else",

  intro:
    "I work where biology meets code: reading gene-expression and sequencing data for the patterns that set disease apart, then following those patterns into the pathways behind them. My training is in computational and systems biology, my everyday tools are Python and R, and my most recent work has been a search for biomarkers in lung adenocarcinoma.",

  about:
    "A master's in computational biology at Jamia Hamdard University, built on an undergraduate degree in botany. Between the two: next-generation sequencing workflows, cancer genomics, a little chemoinformatics and proteomics — and, on the side, a Substack of personal essays.",

  // Grouped from the CV's "Technical Skills" section. Labels follow the
  // CV's own grouping; items are exactly the CV's items.
  skillGroups: [
    {
      label: "Programming & Data",
      skills: ["Python", "R", "SQL", "Java", "Perl"],
    },
    {
      label: "Bioinformatics",
      skills: [
        "BLAST",
        "Clustal Omega",
        "MEGA",
        "PyMOL",
        "IGV",
        "NCBI suite (Entrez, Gene, Protein, GEO)",
      ],
    },
    {
      label: "Specialized Domains",
      skills: [
        "NGS analysis",
        "Differential gene expression",
        "Pathway analysis",
        "Chemoinformatics",
        "Proteomics",
      ],
    },
    {
      label: "AI / Computational Methods",
      skills: [
        "Machine learning",
        "Neural networks",
        "Soft computing",
        "Biomarker discovery pipelines",
      ],
    },
  ],

  links: [{ label: "Substack", href: "https://substack.com/@khizrarehman" }],
};
