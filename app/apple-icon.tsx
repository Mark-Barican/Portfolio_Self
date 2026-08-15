import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Generated Apple touch icon — monogram on the brand yellow. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffff23",
        color: "#0a0a0a",
        fontSize: 96,
        fontWeight: 800,
        letterSpacing: -4,
      }}
    >
      MB
    </div>,
    { ...size },
  );
}
