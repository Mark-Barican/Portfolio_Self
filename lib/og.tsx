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
        background: "#000000",
        backgroundImage:
          "radial-gradient(60% 60% at 50% 0%, rgba(254,127,45,0.28), transparent 70%), radial-gradient(50% 50% at 100% 100%, rgba(35,61,77,0.5), transparent 70%)",
        color: "#eaecf0",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 28,
          color: "#8D9AA3",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 60,
            height: 60,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            alignItems: "center",
            justifyContent: "center",
            color: "#FF9A57",
            fontWeight: 700,
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
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 1,
          }}
        >
          Mark Barican
        </div>
        <div style={{ display: "flex", fontSize: 44, color: "#FF9A57" }}>
          {SITE.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#8D9AA3",
            maxWidth: 860,
          }}
        >
          Building premium web experiences with modern technologies.
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 24, color: "#8D9AA3" }}>
        Next.js · React · TypeScript · Node.js · Three.js
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
