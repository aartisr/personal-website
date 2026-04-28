

import { summaryText } from "../../utils/puck-summary";

export const servicesGridConfig = {
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
    services: {
      type: "array",
      label: "Services",
      arrayFields: {
        icon: { type: "text", label: "Lucide icon name or short text" },
        title: { type: "text", label: "Service Title" },
        description: { type: "textarea", label: "Service Description" },
        href: { type: "text", label: "Link URL (optional)" },
      },
      getItemSummary: (item: unknown) => summaryText(item, "title") || "Service",
    },
  },
  defaultProps: {
    heading: "Our Services",
    anchorId: "",
    description:
      "We offer a comprehensive range of services designed to help your business thrive in the digital age.",
    services: [
      {
        icon: "palette",
        title: "Brand Design",
        description:
          "Craft a visual identity that resonates with your audience and sets you apart from the competition.",
        href: "/services/brand-design",
      },
      {
        icon: "code",
        title: "Web Development",
        description:
          "High-performance websites and web apps built with modern technologies and best practices.",
        href: "/services/web-development",
      },
      {
        icon: "trending-up",
        title: "Growth Marketing",
        description:
          "Data-driven strategies that attract, convert, and retain customers at every stage of the funnel.",
        href: "/services/marketing",
      },
      {
        icon: "globe",
        title: "Cloud Infrastructure",
        description:
          "Scalable, reliable cloud solutions that keep your business running smoothly around the clock.",
        href: "/services/cloud",
      },
      {
        icon: "settings",
        title: "AI Integration",
        description:
          "Leverage the power of AI to automate workflows and unlock new possibilities for your team.",
        href: "/services/ai",
      },
      {
        icon: "shield",
        title: "Security Audits",
        description:
          "Comprehensive security assessments to protect your business and your customers' data.",
        href: "/services/security",
      },
    ],
  },
};
