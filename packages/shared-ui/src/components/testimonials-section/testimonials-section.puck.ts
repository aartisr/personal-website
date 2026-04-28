
import { royalStyleField } from "../royal/royal-field";
import { summaryText } from "../../utils/puck-summary";

export const testimonialsSectionConfig =
  {
    fields: {
      heading: {
        type: "text",
        label: "Section Heading",
      },
      anchorId: {
        type: "text",
        label: "Anchor ID",
      },
      royalStyle: royalStyleField,
      showRating: {
        type: "radio",
        label: "Show Rating Icons",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      testimonials: {
        type: "array",
        label: "Testimonials",
        arrayFields: {
          quote: { type: "textarea", label: "Quote" },
          name: { type: "text", label: "Name" },
          role: { type: "text", label: "Role / Company" },
          avatar: { type: "text", label: "Avatar URL (optional)" },
        },
        getItemSummary: (item: unknown) => summaryText(item, "name") || "Testimonial",
      },
    },
    defaultProps: {
      heading: "What Our Customers Say",
      anchorId: "",
      royalStyle: "none",
      showRating: true,
      testimonials: [
        {
          quote:
            "This platform completely transformed how we manage our digital presence. The results speak for themselves.",
          name: "Sarah Johnson",
          role: "CEO, Acme Corp",
          avatar: "",
        },
        {
          quote:
            "I've tried a dozen tools over the years. Nothing comes close to the simplicity and power here.",
          name: "Marcus Chen",
          role: "Product Lead, Startech",
          avatar: "",
        },
        {
          quote:
            "Our team was up and running in a single afternoon. The onboarding experience is second to none.",
          name: "Priya Patel",
          role: "CTO, Nexus Labs",
          avatar: "",
        },
      ],
    },
  };
