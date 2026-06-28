import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated favicon — accent tile with the "M" monogram. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#8b5cf6",
        color: "#ffffff",
        fontSize: 22,
        fontWeight: 700,
        borderRadius: 7,
      }}
    >
      M
    </div>,
    { ...size },
  );
}
