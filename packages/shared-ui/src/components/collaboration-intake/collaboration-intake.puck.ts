import { summaryText } from "../../utils/puck-summary";

export const collaborationIntakeConfig = {
  fields: {
    eyebrow: { type: "text", label: "Eyebrow" },
    heading: { type: "text", label: "Heading" },
    description: { type: "textarea", label: "Description" },
    agreement: { type: "textarea", label: "Working agreement acknowledgement" },
    paths: { type: "array", label: "Collaboration paths", arrayFields: { id: { type: "select", options: [{ label: "Mentor", value: "mentor" }, { label: "Community", value: "community" }, { label: "Technical", value: "technical" }, { label: "Other", value: "other" }] }, title: { type: "text" }, description: { type: "textarea" }, prompt: { type: "textarea" }, fields: { type: "array", arrayFields: { name: { type: "text" }, label: { type: "text" }, type: { type: "select", options: [{ label: "Text", value: "text" }, { label: "URL", value: "url" }] } } } }, getItemSummary: (item: unknown) => summaryText(item, "title") || "Path" },
    resources: { type: "array", label: "Success resources", arrayFields: { id: { type: "text" }, label: { type: "text" }, href: { type: "text" } }, getItemSummary: (item: unknown) => summaryText(item, "label") || "Resource" },
  },
  defaultProps: { eyebrow: "Collaboration", heading: "Build something useful, with care.", description: "", paths: [], resources: [] },
};
