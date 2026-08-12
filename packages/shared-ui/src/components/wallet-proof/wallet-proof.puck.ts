export const walletProofConfig = {
  fields: {
    anchorId: { type: "text", label: "Anchor ID" },
    heading: { type: "text", label: "Heading" },
    description: { type: "textarea", label: "Description" },
    note: { type: "textarea", label: "Privacy and scope note" },
  },
  defaultProps: {
    anchorId: "wallet-proof",
    heading: "Verify a wallet-based authenticity signal",
    description: "Use a cryptographic signature check to confirm wallet control.",
  },
};
