"use client";

import type { ReactElement } from "react";
import "./GlassIcons.css";

export interface GlassIconsItem {
  icon: ReactElement;
  /** A key from the gradient map below, or any raw CSS color/gradient. */
  color: string;
  label: string;
  customClass?: string;
}

interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

/**
 * GlassIcons — React Bits component (JS + CSS), ported to TypeScript.
 * Renders a grid of frosted-glass icon tiles with a 3D hover lift.
 * Gradients are themed to the site palette (warm orange + deep teal family).
 */
// Keys are retained for compatibility with Skills' CATEGORY_COLORS, but the
// values now span the blue → purple family (no warm tones).
const gradientMapping: Record<string, string> = {
  orange: "linear-gradient(hsl(262, 83%, 64%), hsl(262, 80%, 52%))",
  amber: "linear-gradient(hsl(272, 76%, 62%), hsl(274, 72%, 50%))",
  sand: "linear-gradient(hsl(243, 75%, 62%), hsl(245, 72%, 50%))",
  teal: "linear-gradient(hsl(217, 91%, 60%), hsl(221, 83%, 50%))",
  steel: "linear-gradient(hsl(206, 90%, 58%), hsl(212, 86%, 48%))",
  deep: "linear-gradient(hsl(224, 64%, 30%), hsl(226, 70%, 20%))",
};

const GlassIcons = ({ items, className }: GlassIconsProps) => {
  const getBackgroundStyle = (color: string) => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className ?? ""}`}>
      {items.map((item, index) => (
        <button
          key={index}
          className={`icon-btn ${item.customClass ?? ""}`}
          aria-label={item.label}
          type="button"
        >
          <span
            className="icon-btn__back"
            style={getBackgroundStyle(item.color)}
          />
          <span className="icon-btn__front">
            <span className="icon-btn__icon" aria-hidden="true">
              {item.icon}
            </span>
          </span>
          <span className="icon-btn__label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default GlassIcons;
