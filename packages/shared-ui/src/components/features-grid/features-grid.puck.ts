
import { royalStyleField } from "../royal/royal-field";
import { summaryText } from "../../utils/puck-summary";

export const featuresGridConfig = {
  fields: {
    heading: {
      type: "text",
      label: "Section Heading",
    },
    anchorId: {
      type: "text",
      label: "Anchor ID",
    },
    description: {
      type: "textarea",
      label: "Section Description",
    },
    topSpacing: {
      type: "radio",
      label: "Top Spacing",
      options: [
        { label: "Compact", value: "compact" },
        { label: "Normal", value: "normal" },
        { label: "Relaxed", value: "relaxed" },
      ],
    },
    bottomSpacing: {
      type: "radio",
      label: "Bottom Spacing",
      options: [
        { label: "Compact", value: "compact" },
        { label: "Normal", value: "normal" },
        { label: "Relaxed", value: "relaxed" },
      ],
    },
    columns: {
      type: "radio",
      label: "Columns",
      options: [
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
    },
    animation: {
      type: "radio",
      label: "Scroll Animation",
      options: [
        { label: "Slide Up", value: "slide-up" },
        { label: "Fade In", value: "fade-in" },
        { label: "Scale In", value: "scale-in" },
        { label: "None", value: "none" },
      ],
    },
    royalStyle: royalStyleField,
    processEyebrow: {
      type: "text",
      label: "Process Diagram Eyebrow",
    },
    processSteps: {
      type: "array",
      label: "Process Diagram Steps",
      arrayFields: {
        icon: { type: "text", label: "Lucide icon name or short text" },
        label: { type: "text", label: "Step Label" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "title") || "Step",
    },
    features: {
      type: "array",
      label: "Features",
      arrayFields: {
        icon: { type: "text", label: "Lucide icon name or short text" },
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "title") || "Feature",
    },
  },
  defaultProps: {
    heading: "Everything You Need",
    anchorId: "",
    description:
      "A complete set of features built to help you succeed from day one.",
    topSpacing: "normal",
    bottomSpacing: "normal",
    columns: 3,
    animation: "slide-up",
    royalStyle: "none",
    processEyebrow: "Process diagram",
    processSteps: [
      {
        icon: "search",
        label: "01",
        title: "Frame",
        description: "Define the question, audience, and success signal.",
      },
      {
        icon: "file-text",
        label: "02",
        title: "Collect",
        description: "Capture notes, artifacts, constraints, and evidence.",
      },
      {
        icon: "code",
        label: "03",
        title: "Build",
        description: "Turn the evidence into a reusable, tested system.",
      },
      {
        icon: "check",
        label: "04",
        title: "Validate",
        description: "Review clarity, performance, accessibility, and usefulness.",
      },
    ],
    features: [
      {
        icon: "zap",
        title: "Lightning Fast",
        description:
          "Optimized for performance so your users never wait. Sub-second load times across the board.",
      },
      {
        icon: "shield",
        title: "Secure by Default",
        description:
          "Enterprise-grade security baked in from the ground up, so your data stays safe.",
      },
      {
        icon: "trending-up",
        title: "Powerful Analytics",
        description:
          "Real-time insights that help you understand your users and grow your business.",
      },
      {
        icon: "settings",
        title: "Easy to Customize",
        description:
          "Flexible configuration options that adapt to your workflow without the complexity.",
      },
      {
        icon: "globe",
        title: "Global Scale",
        description:
          "Infrastructure that grows with you, from your first user to your millionth.",
      },
      {
        icon: "message-circle",
        title: "24/7 Support",
        description:
          "Our team is always here to help you succeed, no matter the hour.",
      },
    ],
  },
};
