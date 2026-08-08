
import { summaryText } from "../../utils/puck-summary";

export const headerConfig = {
  fields: {
    logo: {
      type: "text",
      label: "Logo URL",
    },
    logoHref: {
      type: "text",
      label: "Logo Link URL (e.g., /docs/logo or /)",
    },
    logoAlt: {
      type: "text",
      label: "Logo Alt / Brand Name",
    },
    brandName: {
      type: "text",
      label: "Visible Brand Name",
    },
    brandSubtext: {
      type: "text",
      label: "Visible Brand Subtext",
    },
    eyebrow: {
      type: "text",
      label: "Academic Eyebrow",
    },
    affiliation: {
      type: "text",
      label: "Affiliation",
    },
    location: {
      type: "text",
      label: "Location",
    },
    statusLabel: {
      type: "text",
      label: "Status Label",
    },
    navStyle: {
      type: "radio",
      label: "Navigation Style",
      options: [
        { label: "Flat", value: "flat" },
        { label: "Dropdown", value: "dropdown" },
        { label: "Mega Menu", value: "mega" },
      ],
    },
    navItems: {
      type: "array",
      label: "Navigation Items",
      arrayFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "Link URL" },
        children: {
          type: "array",
          label: "Dropdown Items",
          arrayFields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Link URL" },
          },
          getItemSummary: (item: unknown) => summaryText(item, "label") || "Sub Item",
        },
      },
      getItemSummary: (item: unknown) => summaryText(item, "label") || "Nav Item",
    },
    ctaButton: {
      type: "object",
      label: "CTA Button",
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
    utilityLinks: {
      type: "array",
      label: "Utility Links",
      arrayFields: {
        label: { type: "text", label: "Link Label" },
        href: { type: "text", label: "URL" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "label") || "Utility link",
    },
    sticky: {
      type: "radio",
      label: "Sticky Header",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    showReadingProgress: {
      type: "radio",
      label: "Reading Progress Bar",
      options: [
        { label: "Show", value: true },
        { label: "Hide", value: false },
      ],
    },
  },
  defaultProps: {
    logo: "/ravi-aarti-infinity-logo-small.svg",
    logoHref: "/",
    logoAlt: "All Inclusive Aarti",
    brandName: "Knowledge with Kindness",
    brandSubtext: "",
    eyebrow: "Evidence-led portfolio",
    affiliation: "",
    location: "",
    statusLabel: "",
    navStyle: "flat",
    navItems: [
      { label: "Research", href: "/#research" },
      { label: "Method", href: "/#method" },
      { label: "Writing", href: "/blog" },
      { label: "Journey", href: "/testimony" },
      { label: "Contact", href: "/support-center" },
    ],
    ctaButton: {
      label: "Start Collaboration",
      href: "/collaborate",
    },
    secondaryCta: {
      label: "Framework PDF",
      href: "/aether-student-resiliency-framework-2026.pdf",
    },
    utilityLinks: [
      { label: "Framework PDF", href: "/aether-student-resiliency-framework-2026.pdf" },
      { label: "GitHub", href: "https://github.com/aartisr" },
    ],
    sticky: true,
    showReadingProgress: true,
  },
};
