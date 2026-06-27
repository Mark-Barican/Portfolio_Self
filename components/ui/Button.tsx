import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-black shadow-[0_8px_30px_-8px_rgba(254,127,45,0.65)] hover:bg-accent-hover hover:shadow-[0_12px_40px_-8px_rgba(255,154,87,0.75)]",
  secondary:
    "glass text-foreground hover:border-white/20 hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-foreground",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Polymorphic pill button. Renders an `<a>` when `href` is provided, otherwise
 * a `<button>`. Pure styling — wrap with `<Magnetic>` for the hover pull.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (props.href !== undefined) {
    const {
      variant: _v,
      size: _s,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    return (
      <a className={classes} {...rest}>
        {children}
      </a>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...rest
  } = props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
