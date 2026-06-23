import { ImageResponse } from "next/og";
import { siteProfile } from "@/lib/seo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 56,
          background: "#fbfaf4",
          color: "#13213a",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "3px solid #183f84",
            paddingBottom: 24,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                color: "#183f84",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Student Research Portfolio
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 10,
                fontSize: 22,
                color: "#5b6472",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {siteProfile.school} • {siteProfile.location}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: 116,
              height: 116,
              borderRadius: 58,
              border: "3px solid #d5b25f",
              background: "#ffffff",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              lineHeight: 1,
              color: "#d97706",
              fontFamily: "Arial, sans-serif",
            }}
          >
            ∞
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          <div
            style={{
              display: "flex",
              margin: 0,
              maxWidth: 900,
              fontSize: 86,
              lineHeight: 0.98,
              fontWeight: 700,
            }}
          >
            {siteProfile.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              maxWidth: 940,
              fontSize: 32,
              lineHeight: 1.28,
              color: "#39465b",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Evidence-led software projects, resilient learning systems, and technical writing.
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 28, fontFamily: "Arial, sans-serif" }}>
          {[
            "Research",
            "Methods",
            "Writing",
            "Collaboration",
          ].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                border: "2px solid #d8d1bf",
                padding: "10px 16px",
                fontSize: 22,
                color: "#183f84",
                background: "#ffffff",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
