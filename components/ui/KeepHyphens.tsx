import { Fragment } from "react";

/**
 * Text that never breaks a line at a hyphen inside a word: "Full-stack" wraps
 * as a whole, never as "Full-" over "stack".
 *
 * For display headings. Set this wide, a split compound reads as two unrelated
 * words and leaves a dangling hyphen at the end of the line. Each hyphenated
 * word is held together with `nowrap`; the spaces between words are untouched,
 * so the heading still wraps normally everywhere else.
 */
export function KeepHyphens({ text }: { text: string }) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    part.includes("-") ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
