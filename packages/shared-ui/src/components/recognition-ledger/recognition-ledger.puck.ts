import { summaryText } from "../../utils/puck-summary";

export const recognitionLedgerConfig = {
  fields: {
    anchorId: { type: "text", label: "Anchor ID" },
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    description: { type: "textarea", label: "Description" },
    verificationNote: { type: "textarea", label: "Verification note" },
    records: {
      type: "array", label: "Recognition records",
      arrayFields: {
        title: { type: "text", label: "Recognition title" },
        issuer: { type: "text", label: "Issuer" },
        year: { type: "text", label: "Year" },
        location: { type: "text", label: "Location" },
        category: { type: "select", label: "Category", options: [
          { label: "Innovation & AI", value: "Innovation & AI" },
          { label: "Math & science", value: "Math & science" },
          { label: "Community problem-solving", value: "Community problem-solving" },
          { label: "School & regional fairs", value: "School & regional fairs" },
        ] },
        recognition: { type: "textarea", label: "What was recognized" },
        project: { type: "textarea", label: "Project context" },
        note: { type: "textarea", label: "Editorial note" },
        evidenceUrl: { type: "text", label: "Evidence URL" },
        evidenceLabel: { type: "text", label: "Evidence link label" },
        verification: { type: "select", label: "Verification state", options: [
          { label: "Documented", value: "Documented" },
          { label: "Official source pending", value: "Official source pending" },
        ] },
      },
      getItemSummary: (item: unknown) => summaryText(item, "title") || "Recognition",
    },
  },
  defaultProps: { anchorId: "recognition-record", heading: "Recognition record", description: "A verified ledger of awards and project recognition.", records: [] },
};
