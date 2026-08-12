

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
    logoAlt: "ai-aarti.com",
    brandName: "ai-aarti.com",
    eyebrow: "Research, innovation & community impact",
    tagline:
      "The company and public portfolio led by Founder & CEO Aarti Sri Ravikumar: research-informed software, mathematical inquiry, and useful systems for communities.",
    affiliation: "Pioneer Charter School of Science II",
    location: "Saugus, Massachusetts",
    availability:
      "Open to thoughtful academic, technical, and community collaboration with clear questions, scope, and evidence standards.",
    citation:
      "ai-aarti.com. Research, innovation, and community-impact portfolio led by Founder & CEO Aarti Sri Ravikumar. 2026.",
    primaryAction: {
      label: "Start Collaboration",
      href: "/collaborate",
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
        title: "Explore",
        links: [
          { label: "Research agenda", href: "/#research" },
          { label: "Community work", href: "/#community-work" },
          { label: "Method", href: "/#method" },
          { label: "Recognition record", href: "/honors-service" },
        ],
      },
      {
        title: "Learn & connect",
        links: [
          { label: "Research notes", href: "/blog" },
          { label: "Academic journey", href: "/testimony" },
          { label: "Collaboration", href: "/collaborate" },
          { label: "Support center", href: "/support-center" },
        ],
      },
      {
        title: "Trust & policies",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms of Service", href: "/terms-of-service" },
          { label: "Authenticity proof", href: "/web3-proof" },
          { label: "GitHub profile", href: "https://github.com/aartisr" },
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
    copyright: `© ${new Date().getFullYear()} ai-aarti.com. All rights reserved.`,
  },
};
