import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Generated favicon — yellow tile with the "M" monogram. */
export default function Icon() {
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
        fontSize: 22,
        fontWeight: 800,
        borderRadius: 7,
        border: "2px solid #0a0a0a",
      }}
    >
      M
    </div>,
    { ...size },
  );
}
