import type { MetadataRoute } from "next";
import { siteProfile } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteProfile.title,
    short_name: siteProfile.shortName,
    description: siteProfile.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf4",
    theme_color: "#183f84",
    categories: ["education", "portfolio", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
