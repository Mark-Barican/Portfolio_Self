import { createOgImage, OG_SIZE } from "@/lib/og";

export const alt = "Mark Barican — Full-Stack Developer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function TwitterImage() {
  return createOgImage();
}
