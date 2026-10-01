/**
 * Research case studies. Source of truth: Khizra's CV ("Key Project").
 *
 * Keep claims within what the CV states — no numerical results, dataset
 * names, specific packages or clinical claims beyond it. Optional fields
 * are left out rather than guessed; fill them in only from her own notes.
 */

export type ResearchProject = {
  slug: string;
  /** The full, formal title. */
  title: string;
  /** A short title for headings and previews. */
  shortTitle: string;
  kind: string;
  /** One sentence: the question the project starts from. */
  premise: string;
  context: string;
  /** How the work was done, in order. */
  methods: string[];
  /** The biological question the work sits inside. */
  focus: string;
  outcome: string;
  technologies: string[];
  featured?: boolean;
  /** Not given on the CV — leave unset until confirmed. */
  year?: string;
  href?: string;
};

export const research: ResearchProject[] = [
  {
    slug: "lung-adenocarcinoma-biomarkers",
    title:
      "Uncovering Crucial Biomarkers for Pathway Analysis in Lung Adenocarcinoma via Differential Gene Expression",
    shortTitle: "Biomarkers in lung adenocarcinoma",
    kind: "Independent research project",
    premise:
      "Which genes behave differently in lung adenocarcinoma — and which of those differences point to pathways worth a closer look?",
    context:
      "An independent project in cancer genomics: using differential gene expression to find genetic biomarkers in lung adenocarcinoma, then reading those genes in the context of the biological pathways they belong to.",
    methods: [
      "Designed and ran an end-to-end differential gene expression analysis, using statistical and computational methods.",
      "Processed large-scale genomic datasets with Python, R and NGS-oriented pipelines.",
      "Performed pathway enrichment analysis on the differentially expressed genes.",
      "Moved from raw data processing through to biological interpretation and prioritising candidate genes.",
    ],
    focus:
      "Gene-expression changes in lung adenocarcinoma, and the pathways that connect them.",
    outcome:
      "A set of candidate genes of potential clinical value, intended to support further research into early diagnosis and targeted therapy.",
    technologies: [
      "Python",
      "R",
      "NGS pipelines",
      "Differential gene expression",
      "Pathway enrichment analysis",
    ],
    featured: true,
  },
];

export const featuredResearch = research.find((project) => project.featured) ?? research[0];
