import type { ReactNode, SVGProps } from 'react'

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  /** Edge length in pixels. Line weight is tuned for 14–18. */
  size?: number
}

/**
 * Shared frame for every line icon: one viewBox, one stroke weight, one set of
 * joins.
 *
 * Drawn inline instead of pulled from a package because the app needs eight
 * glyphs, and an icon library is a dependency plus a build step for that. What
 * matters is that they are all drawn on the same grid — arrows from three
 * different sources never line up with each other.
 */
export function Icon({
  size = 16,
  children,
  ...props
}: IconProps & { children: ReactNode }) {
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
  )
}
