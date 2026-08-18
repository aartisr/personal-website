import { summaryText } from "../../utils/puck-summary";

export const communityChallengeLedgerConfig = {
  fields: {
    anchorId: { type: "text", label: "Anchor ID" },
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    description: { type: "textarea", label: "Description" },
    projects: {
      type: "array", label: "Projects",
      arrayFields: {
        name: { type: "text", label: "Project Name" },
        challenge: { type: "textarea", label: "Community Challenge" },
        contribution: { type: "textarea", label: "Contribution" },
        category: { type: "text", label: "Category (optional)" },
        evidenceState: { type: "text", label: "Evidence State" },
        href: { type: "text", label: "Repository URL" },
        liveHref: { type: "text", label: "Live Experience URL (optional)" },
        liveLabel: { type: "text", label: "Live Experience Label (optional)" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "name") || "Project",
    },
  },
  defaultProps: {
    anchorId: "community-work", eyebrow: "Community challenge ledger", heading: "Projects connected to the people they are meant to serve.", description: "A transparent project register.", projects: [],
  },
};
