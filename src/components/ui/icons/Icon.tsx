import type { ReactNode } from "react";
import type { IconProps } from "./types";

/**
 * Shared frame for every line icon: one viewBox, one stroke weight, one set of
 * joins.
 *
 * Drawn inline instead of pulled from a package because the app needs eight
 * glyphs, and an icon library is a dependency plus a build step for that. What
 * matters is that they are all drawn on the same grid — arrows from three
 * different sources never line up with each other.
 */
const Icon: React.FC<IconProps & { children: ReactNode }> = ({
  size = 16,
  children,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
};

export { Icon };
