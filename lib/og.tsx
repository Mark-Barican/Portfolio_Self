import { ImageResponse } from "next/og";
import { SITE } from "@/lib/constants";

/** Shared dimensions for the OpenGraph + Twitter share images. */
export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Renders the social share card. Shared by `opengraph-image` and
 * `twitter-image` so the artwork stays in one place.
 */
export function createOgImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#d5cfbe",
        color: "#0a0a0a",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 28,
          color: "#555652",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 60,
            height: 60,
            borderRadius: 30,
            border: "3px solid #0a0a0a",
            background: "#ffff23",
            alignItems: "center",
            justifyContent: "center",
            color: "#0a0a0a",
            fontWeight: 800,
            fontSize: 30,
          }}
        >
          MB
        </div>
        mark-barican.vercel.app
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div
          style={{
            display: "flex",
            fontSize: 116,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          Mark Barican
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {SITE.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#555652",
            maxWidth: 860,
          }}
        >
          Building web experiences that look and work exactly how you imagined.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignSelf: "flex-start",
          fontSize: 24,
          color: "#0a0a0a",
          background: "#ffff23",
          border: "3px solid #0a0a0a",
          borderRadius: 999,
          padding: "12px 28px",
          fontWeight: 700,
        }}
      >
        Next.js · React · TypeScript · Node.js · Three.js
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
