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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfaf4",
          color: "#13213a",
          padding: "70px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            borderBottom: "3px solid #183f84",
            paddingBottom: "34px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 30,
                letterSpacing: 0,
                color: "#183f84",
                fontFamily: "Arial, sans-serif",
                fontWeight: 700,
              }}
            >
              Student Research Portfolio
            </span>
            <span
              style={{
                marginTop: 12,
                fontSize: 24,
                color: "#5b6472",
                fontFamily: "Arial, sans-serif",
              }}
            >
              {siteProfile.school} • {siteProfile.location}
            </span>
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              border: "3px solid #d5b25f",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 42,
              fontWeight: 700,
              color: "#183f84",
              fontFamily: "Arial, sans-serif",
            }}
          >
            AR
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h1
            style={{
              margin: 0,
              maxWidth: 900,
              fontSize: 92,
              lineHeight: 0.98,
              letterSpacing: 0,
              fontWeight: 700,
            }}
          >
            {siteProfile.name}
          </h1>
          <p
            style={{
              margin: "28px 0 0",
              maxWidth: 900,
              fontSize: 34,
              lineHeight: 1.28,
              color: "#39465b",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Evidence-led software projects, resilient learning systems, and
            technical writing.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 18,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {["Research", "Methods", "Writing", "Collaboration"].map((item) => (
            <span
              key={item}
              style={{
                border: "2px solid #d8d1bf",
                padding: "12px 18px",
                fontSize: 24,
                color: "#183f84",
                background: "#ffffff",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  );
}
