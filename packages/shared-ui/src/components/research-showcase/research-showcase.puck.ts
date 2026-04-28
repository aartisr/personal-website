import { summaryText } from "../../utils/puck-summary";

export const researchShowcaseConfig = {
  fields: {
    anchorId: {
      type: "text",
      label: "Anchor ID",
    },
    eyebrow: {
      type: "text",
      label: "Eyebrow",
    },
    heading: {
      type: "text",
      label: "Section Heading",
    },
    description: {
      type: "textarea",
      label: "Section Description",
    },
    items: {
      type: "array",
      label: "Evidence Items",
      arrayFields: {
        eyebrow: { type: "text", label: "Item Eyebrow" },
        status: { type: "text", label: "Status" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        method: { type: "textarea", label: "Method" },
        evidence: { type: "textarea", label: "Evidence" },
        outcome: { type: "textarea", label: "Outcome" },
        href: { type: "text", label: "Evidence URL" },
        tags: { type: "text", label: "Tags (comma separated)" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "title") || "Evidence Item",
    },
  },
  defaultProps: {
    anchorId: "research",
    eyebrow: "Research agenda",
    heading: "Evidence-backed projects and active lines of inquiry",
    description:
      "Use this section to present research tracks, projects, and source material with consistent evidence, method, and outcome fields.",
    items: [
      {
        eyebrow: "Track 01",
        status: "Active",
        title: "Research Track",
        description:
          "A concise description of the question, project, or research direction.",
        method: "Define a hypothesis, prototype, measure, document, and iterate.",
        evidence: "Repository, paper, artifact, or published note.",
        outcome: "Clear next step or demonstrated result.",
        href: "",
        tags: "research, systems, writing",
      },
    ],
  },
};
