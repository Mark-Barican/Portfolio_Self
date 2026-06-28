"use client";

import dynamic from "next/dynamic";
import { LINKS, NAV_SECTIONS } from "@/lib/constants";

// gsap + useLayoutEffect are browser-only, so load the menu on the client.
const StaggeredMenu = dynamic(
  () => import("@/components/reactbits/StaggeredMenu"),
  { ssr: false },
);

const items = NAV_SECTIONS.map((s) => ({
  label: s.label,
  ariaLabel: `Go to ${s.label}`,
  link: s.href,
}));

const socialItems = [
  { label: "GitHub", link: LINKS.github },
  { label: "LinkedIn", link: LINKS.linkedin },
  { label: "Email", link: LINKS.email },
];

/**
 * Site navigation built on the React Bits StaggeredMenu, themed to the
 * black / teal / orange palette.
 */
export function Menu() {
  return (
    <StaggeredMenu
      position="right"
      isFixed
      items={items}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering
      colors={["#1e3a8a", "#8b5cf6"]}
      accentColor="#8b5cf6"
      menuButtonColor="#EAECF0"
      openMenuButtonColor="#EAECF0"
      logoUrl="/logo.svg"
    />
  );
}
