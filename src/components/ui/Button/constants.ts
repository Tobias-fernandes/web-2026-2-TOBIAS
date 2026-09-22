import type { ButtonVariant } from "./types";

/**
 * Shape and spacing, apart from the colours.
 *
 * Split out so a `<Link>` that acts as a button can wear it: a route change is
 * an anchor, not a button, and a hand-copied class string is the one that stops
 * matching the day the padding changes.
 */
export const BUTTON_BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55";

export const BUTTON_VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: "bg-violeta-forte text-white hover:bg-violeta-escuro",
  outline: "border border-tinta text-tinta hover:bg-tinta hover:text-papel",
  subtle:
    "border border-linha bg-papel-alto text-tinta-suave hover:text-tinta hover:border-tinta",
  // Destructive, but quiet until the pointer is on it: a permanently filled red
  // button in a sidebar footer shouts at the reader on every screen.
  danger:
    "border border-vermelho/35 text-vermelho hover:border-vermelho-forte hover:bg-vermelho-forte hover:text-white",
  dangerSolid: "bg-vermelho-forte text-white hover:bg-vermelho-escuro",
};
