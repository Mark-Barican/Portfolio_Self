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
const gradientMapping: Record<string, string> = {
  orange: "linear-gradient(hsl(25, 99%, 62%), hsl(20, 96%, 50%))",
  amber: "linear-gradient(hsl(33, 96%, 62%), hsl(25, 95%, 52%))",
  sand: "linear-gradient(hsl(28, 58%, 60%), hsl(22, 52%, 46%))",
  teal: "linear-gradient(hsl(201, 38%, 33%), hsl(201, 38%, 22%))",
  steel: "linear-gradient(hsl(201, 30%, 45%), hsl(201, 36%, 30%))",
  deep: "linear-gradient(hsl(201, 45%, 18%), hsl(201, 52%, 10%))",
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
