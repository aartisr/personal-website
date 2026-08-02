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
        evidenceState: { type: "text", label: "Evidence State" },
        href: { type: "text", label: "Repository URL" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "name") || "Project",
    },
  },
  defaultProps: {
    anchorId: "community-work", eyebrow: "Community challenge ledger", heading: "Projects connected to the people they are meant to serve.", description: "A transparent project register.", projects: [],
  },
};
