import { StackChoreography } from "@/components/sections/StackChoreography";
import { TECH_MARKS } from "@/lib/techMarks";
import { cn } from "@/lib/utils";

/**
 * A single floating mark. Cream card, ink rule, logo over the name, exactly the
 * object the old WebGL flythrough was rasterising onto a texture: except this
 * one is real DOM, so it is selectable, searchable, and costs nothing to draw.
 */
function TechCard({
  name,
  size,
  rotate,
}: {
  name: string;
  size: "sm" | "md" | "lg";
  rotate: number;
}) {
  const Mark = TECH_MARKS[name];
  return (
    <div
      // `rotate` is inline because each card gets its own angle; everything
      // else is a class. Transform only, so the tilt costs nothing.
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cn(
        "flex aspect-square flex-col items-center justify-center gap-4 border-2 border-ink bg-card shadow-lifted",
        size === "sm" && "w-[6.5rem]",
        size === "md" && "w-[8.5rem]",
        size === "lg" && "w-[11rem]",
      )}
    >
      {Mark && (
        <Mark
          aria-hidden
          className={cn(
            "shrink-0 text-ink",
            size === "sm" && "size-8",
            size === "md" && "size-11",
            size === "lg" && "size-14",
          )}
        />
      )}
      <span
        className={cn(
          "font-display px-2 text-center leading-none text-ink",
          size === "sm" && "text-[0.7rem]",
          size === "md" && "text-sm",
          size === "lg" && "text-lg",
        )}
      >
        {name}
      </span>
    </div>
  );
}

/**
 * Three depth planes. Cards further back are smaller, dimmer, and arrive later
 * and from further away; the near plane is large, full strength and leads.
 * That spread is the entire effect: same object, three rates.
 *
 * Grouped into planes rather than animated individually so the choreography is
 * three staggered tweens rather than eleven separate ones.
 */
const PLANES = [
  {
    name: "far",
    className: "opacity-45",
    cards: [
      { name: "Prisma", size: "sm", rotate: -8, left: "6%", top: "6%" },
      { name: "GraphQL", size: "sm", rotate: 6, left: "43%", top: "2%" },
      { name: "Figma", size: "sm", rotate: -5, left: "78%", top: "10%" },
      { name: "Firebase", size: "sm", rotate: 9, left: "26%", top: "58%" },
    ],
  },
  {
    name: "mid",
    className: "opacity-80",
    cards: [
      { name: "Node.js", size: "md", rotate: 5, left: "16%", top: "26%" },
      { name: "Tailwind CSS", size: "md", rotate: -4, left: "56%", top: "48%" },
      { name: "Shopify", size: "md", rotate: 7, left: "83%", top: "44%" },
    ],
  },
  {
    name: "near",
    className: "",
    cards: [
      { name: "TypeScript", size: "lg", rotate: -6, left: "2%", top: "38%" },
      { name: "Next.js", size: "lg", rotate: 4, left: "31%", top: "22%" },
      { name: "React", size: "lg", rotate: -3, left: "63%", top: "8%" },
      { name: "PostgreSQL", size: "lg", rotate: 6, left: "46%", top: "62%" },
    ],
  },
] as const;

/**
 * The floating stack composition.
 *
 * Desktop only, and deliberately so: it is a fixed-height stage with cards
 * placed by percentage, which is expressive at 1024px and up and would be an
 * unreadable pile on a phone. Below `lg` the section shows the grouped list
 * alone, which carries the same information in reading order.
 *
 * Marked `aria-hidden` in full. Every technology on these cards also appears in
 * the labelled list underneath, so exposing the stage would read the same names
 * twice, out of order and without their grouping.
 */
export function StackStage() {
  return (
    <StackChoreography>
      <div
        aria-hidden
        className="relative hidden h-[34rem] w-full select-none lg:block"
      >
        {PLANES.map((plane) => (
          <div
            key={plane.name}
            data-plane={plane.name}
            className={cn("absolute inset-0", plane.className)}
          >
            {plane.cards.map((card) => (
              <div
                key={card.name}
                data-card
                className="absolute"
                style={{ left: card.left, top: card.top }}
              >
                <TechCard
                  name={card.name}
                  size={card.size}
                  rotate={card.rotate}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </StackChoreography>
  );
}
