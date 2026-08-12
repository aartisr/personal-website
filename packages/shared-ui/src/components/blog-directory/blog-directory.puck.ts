export const blogDirectoryConfig = {
  fields: { anchorId: { type: "text", label: "Anchor ID" }, heading: { type: "text", label: "Heading" }, description: { type: "textarea", label: "Description" }, emptyMessage: { type: "text", label: "Empty-state message" } },
  defaultProps: { anchorId: "articles", heading: "Published research notes", description: "Search the latest writing." },
};
