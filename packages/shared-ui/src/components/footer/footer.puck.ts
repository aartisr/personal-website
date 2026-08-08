

import { summaryText } from "../../utils/puck-summary";

export const footerConfig = {
  fields: {
    logo: {
      type: "text",
      label: "Logo URL",
    },
    logoAlt: {
      type: "text",
      label: "Logo Alt Text",
    },
    brandName: {
      type: "text",
      label: "Brand Name",
    },
    eyebrow: {
      type: "text",
      label: "Eyebrow",
    },
    tagline: {
      type: "textarea",
      label: "Tagline",
    },
    affiliation: {
      type: "text",
      label: "Affiliation",
    },
    location: {
      type: "text",
      label: "Location",
    },
    availability: {
      type: "textarea",
      label: "Availability / Reviewer Note",
    },
    citation: {
      type: "textarea",
      label: "Preferred Citation",
    },
    primaryAction: {
      type: "object",
      label: "Primary Action",
      objectFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "URL" },
      },
    },
    secondaryAction: {
      type: "object",
      label: "Secondary Action",
      objectFields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "URL" },
      },
    },
    highlights: {
      type: "array",
      label: "Research Focus Chips",
      arrayFields: {
        text: { type: "text", label: "Text" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "text") || "Focus",
    },
    columns: {
      type: "array",
      label: "Link Columns",
      arrayFields: {
        title: {
          type: "text",
          label: "Column Title",
        },
        links: {
          type: "array",
          label: "Links",
          arrayFields: {
            label: { type: "text", label: "Link Label" },
            href: { type: "text", label: "URL" },
          },
          getItemSummary: (item: unknown) => summaryText(item, "label") || "Link",
        },
      },
      getItemSummary: (item: unknown) => summaryText(item, "title") || "Column",
    },
    socialLinks: {
      type: "array",
      label: "Social Links",
      arrayFields: {
        platform: {
          type: "select",
          label: "Platform",
          options: [
            { label: "Twitter / X", value: "twitter" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Facebook", value: "facebook" },
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "GitHub", value: "github" },
          ],
        },
        url: {
          type: "text",
          label: "Profile URL",
        },
      },
      getItemSummary: (item: unknown) =>
        summaryText(item, "platform") || "Social link",
    },
    utilityLinks: {
      type: "array",
      label: "Bottom Utility Links",
      arrayFields: {
        label: { type: "text", label: "Link Label" },
        href: { type: "text", label: "URL" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "label") || "Utility link",
    },
    copyright: {
      type: "text",
      label: "Copyright Text",
    },
  },
  defaultProps: {
    logo: "/ravi-aarti-infinity-logo.svg",
    logoAlt: "All Inclusive Aarti",
    brandName: "All Inclusive Aarti (ai-aarti)",
    eyebrow: "Student Research Portfolio",
    tagline:
      "Knowledge is boundless, kindness is the path, and enlightenment emerges from the sacred balance of rising aspiration and grounded wisdom. All are included.",
    affiliation: "Pioneer Charter School of Science II",
    location: "Saugus, Massachusetts",
    availability:
      "Open to thoughtful academic and technical collaboration with clear questions, scope, and evidence standards.",
    citation:
      "All Inclusive Aarti. Academic and Kindness Research Portfolio. 2026. https://ai-aarti.com",
    primaryAction: {
      label: "Start Collaboration",
      href: "/support-center",
    },
    secondaryAction: {
      label: "Review GitHub",
      href: "https://github.com/aartisr",
    },
    highlights: [
      { text: "Research-informed software" },
      { text: "Resilient learning systems" },
      { text: "Technical writing" },
      { text: "Search and AI legibility" },
    ],
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
          { label: "Changelog", href: "/changelog" },
          { label: "Roadmap", href: "/roadmap" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Service", href: "/terms-of-service" },
          { label: "Cookie Policy", href: "/cookies" },
        ],
      },
    ],
    socialLinks: [
      { platform: "github", url: "https://github.com/aartisr" },
      { platform: "instagram", url: "https://www.instagram.com/pcssii/" },
    ],
    utilityLinks: [
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms-of-service" },
      { label: "Support", href: "/support-center" },
    ],
    copyright: `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
  },
};
