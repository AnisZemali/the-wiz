import { ImageResponse } from "next/og";
export const dynamic = "force-static";

export const alt =
  "The Wiz — premium study notebooks for medicine, pharmacy and dental medicine";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Monochrome social card, generated at build time. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          color: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            color: "#8a8a8a",
          }}
        >
          <span>STUDY NOTEBOOKS</span>
          <span>MEDICINE · PHARMACY · DENTAL SURGERY</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 168, fontWeight: 700, letterSpacing: -8 }}>
            THE WIZ
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 34,
              color: "#5c5c5c",
              maxWidth: 820,
            }}
          >
            One notebook per subject, every year — built to help medical
            students study smarter.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 22,
            color: "#8a8a8a",
            borderTop: "1px solid #e6e6e6",
            paddingTop: 28,
          }}
        >
          <span>Summaries</span>
          <span>Diagrams</span>
          <span>Mnemonics</span>
          <span>Note pages</span>
        </div>
      </div>
    ),
    size,
  );
}
