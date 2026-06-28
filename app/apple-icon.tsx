import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Generated Apple touch icon — monogram on the brand background. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#000000",
        backgroundImage:
          "radial-gradient(80% 80% at 50% 0%, rgba(139,92,246,0.5), transparent 70%)",
        color: "#a78bfa",
        fontSize: 96,
        fontWeight: 700,
        letterSpacing: -4,
      }}
    >
      MB
    </div>,
    { ...size },
  );
}
