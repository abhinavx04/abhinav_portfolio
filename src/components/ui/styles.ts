// Shared class strings: one treatment per role (DESIGN.md, "Motion language").

/** Primary CTA: solid orange, lifts 2px and lightens on hover, presses on pointer-down. */
export const buttonPrimary =
  "press inline-flex items-center gap-2 rounded-ui bg-orange px-6 py-3.5 text-body font-semibold text-on-orange " +
  "transition-[background-color,translate] duration-200 ease-[var(--ease-settle)] hover:-translate-y-0.5 hover:bg-orange-light";

/** Quiet secondary link: text with an underline that is always visible (it's a link). */
export const linkQuiet =
  "inline-flex items-center gap-1.5 py-2 text-body font-semibold text-text underline decoration-border decoration-2 " +
  "underline-offset-[6px] transition-colors duration-200 hover:decoration-orange";

/** Section heading: poster type. */
export const sectionTitle = "text-display font-black uppercase text-balance";
