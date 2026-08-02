

import { summaryText } from "../../utils/puck-summary";

export const statsCounterConfig = {
  fields: {
    anchorId: {
      type: "text",
      label: "Anchor ID",
    },
    animation: {
      type: "radio",
      label: "Scroll Animation",
      options: [
        { label: "Scale In", value: "scale-in" },
        { label: "Slide Up", value: "slide-up" },
        { label: "Fade In", value: "fade-in" },
        { label: "None", value: "none" },
      ],
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
    dynamicMetricsEndpoint: {
      type: "text",
      label: "Dynamic Metrics Endpoint",
    },
    stats: {
      type: "array",
      label: "Stats",
      arrayFields: {
        value: {
          type: "text",
          label: "Value (number)",
        },
        label: {
          type: "text",
          label: "Label",
        },
        prefix: {
          type: "text",
          label: "Prefix (e.g. $, €)",
        },
        suffix: {
          type: "text",
          label: "Suffix (e.g. +, %, K)",
        },
        metricKey: {
          type: "text",
          label: "Dynamic Metric Key",
        },
      },
      getItemSummary: (item: unknown) => {
        const label = summaryText(item, "label");
        const prefix = summaryText(item, "prefix");
        const value = summaryText(item, "value");
        const suffix = summaryText(item, "suffix");
        return label ? `${prefix}${value}${suffix} — ${label}` : "Stat";
      },
    },
  },
  defaultProps: {
    anchorId: "",
    animation: "scale-in",
    topSpacing: "normal",
    bottomSpacing: "normal",
    dynamicMetricsEndpoint: "/api/github-stats",
    stats: [
      {
        value: "131",
        label: "GitHub Contributions",
        prefix: "",
        suffix: "+",
        metricKey: "githubContributions",
      },
      {
        value: "25",
        label: "Public Repositories",
        prefix: "",
        suffix: "+",
        metricKey: "githubPublicRepos",
      },
      {
        value: "2",
        label: "Active Research Tracks",
        prefix: "",
        suffix: "",
        metricKey: "githubActiveResearchTracks",
      },
      {
        value: "4",
        label: "Reviewer Pathways",
        prefix: "",
        suffix: "",
        metricKey: "",
      },
    ],
  },
};
