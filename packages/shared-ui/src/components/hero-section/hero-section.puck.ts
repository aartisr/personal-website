import { royalStyleField } from "../royal/royal-field";
import { summaryText } from "../../utils/puck-summary";

export const heroSectionConfig = {
  fields: {
    variant: {
      type: "radio",
      label: "Layout Variant",
      options: [
        { label: "Centered", value: "centered" },
        { label: "Split Image", value: "split-image" },
        { label: "Background Image", value: "background-image" },
        { label: "Gradient Overlay", value: "gradient-overlay" },
        { label: "Editorial", value: "editorial" },
        { label: "Stacked Narrative", value: "stacked-narrative" },
        { label: "Minimal Typography", value: "minimal-type" },
        { label: "Dark Split", value: "dark-split" },
        { label: "Dark Centered", value: "dark-centered" },
        { label: "Dark Device Mockup", value: "dark-device" },
      ],
    },
    heading: {
      type: "text",
      label: "Heading",
    },
    subheading: {
      type: "text",
      label: "Subheading / Eyebrow",
    },
    description: {
      type: "textarea",
      label: "Description",
    },
    highlights: {
      type: "array",
      label: "Trust Highlights",
      arrayFields: {
        text: { type: "text", label: "Highlight" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "text") || "Highlight",
    },
    proofPoints: {
      type: "array",
      label: "Proof Points",
      arrayFields: {
        value: { type: "text", label: "Value" },
        label: { type: "text", label: "Label" },
        prefix: { type: "text", label: "Prefix" },
        suffix: { type: "text", label: "Suffix" },
        metricKey: { type: "text", label: "Dynamic Metric Key" },
      },
      getItemSummary: (item: unknown) => {
        const label = summaryText(item, "label");
        const value = summaryText(item, "value");
        return label ? `${value} — ${label}` : "Proof point";
      },
    },
    dynamicMetricsEndpoint: {
      type: "text",
      label: "Dynamic Metrics Endpoint",
    },
    primaryCta: {
      type: "object",
      label: "Primary CTA",
      objectFields: {
        label: { type: "text", label: "Button Label" },
        href: { type: "text", label: "Button URL" },
      },
    },
    secondaryCta: {
      type: "object",
      label: "Secondary CTA",
      objectFields: {
        label: { type: "text", label: "Button Label" },
        href: { type: "text", label: "Button URL" },
      },
    },
    image: {
      type: "text",
      label: "Image URL",
    },
    imageAlt: {
      type: "text",
      label: "Image Alt Text",
    },
    overlayOpacity: {
      type: "radio",
      label: "Overlay Darkness (background variants)",
      options: [
        { label: "Light (40%)", value: 40 },
        { label: "Medium (60%)", value: 60 },
        { label: "Heavy (80%)", value: 80 },
      ],
    },
    minHeight: {
      type: "radio",
      label: "Section Height (background variants)",
      options: [
        { label: "Full viewport", value: "100vh" },
        { label: "Tall (80vh)", value: "80vh" },
        { label: "Medium (60vh)", value: "60vh" },
      ],
    },
    animation: {
      type: "radio",
      label: "Scroll Animation",
      options: [
        { label: "Fade In", value: "fade-in" },
        { label: "Slide Up", value: "slide-up" },
        { label: "None", value: "none" },
      ],
    },
    royalStyle: royalStyleField,
  },
  defaultProps: {
    variant: "centered",
    heading: "Build Something Extraordinary",
    subheading: "Welcome",
    description:
      "A powerful platform designed to help you create, manage, and scale your digital presence with ease.",
    highlights: [
      { text: "Research-backed" },
      { text: "Objective communication" },
      { text: "Accessible by design" },
    ],
    proofPoints: [
      {
        value: "131",
        label: "Contributions",
        prefix: "",
        suffix: "+",
        metricKey: "githubContributions",
      },
      {
        value: "25",
        label: "Public repositories",
        prefix: "",
        suffix: "+",
        metricKey: "githubPublicRepos",
      },
      {
        value: "2",
        label: "Research tracks",
        prefix: "",
        suffix: "",
        metricKey: "githubActiveResearchTracks",
      },
    ],
    dynamicMetricsEndpoint: "/api/github-stats",
    primaryCta: {
      label: "Get Started",
      href: "/contact",
    },
    secondaryCta: {
      label: "Learn More",
      href: "/about",
    },
    image: "",
    imageAlt: "Hero image",
    overlayOpacity: 60,
    minHeight: "80vh",
    animation: "fade-in",
    royalStyle: "none",
  },
};
