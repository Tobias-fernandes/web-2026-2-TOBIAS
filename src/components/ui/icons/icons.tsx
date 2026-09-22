import { Icon, type IconProps } from './Icon'

/* Navigation ------------------------------------------------------------- */

export const ChevronLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 3.5 5.5 8l4.5 4.5" />
  </Icon>
)

export const ChevronRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 3.5 10.5 8 6 12.5" />
  </Icon>
)

export const ChevronDownIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 6 8 10.5 12.5 6" />
  </Icon>
)

/** A full arrow, for "go to this place" rather than "step one over". */
export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 8h11M9.5 4l4 4-4 4" />
  </Icon>
)

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
  </Icon>
)

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 4l8 8M12 4l-8 8" />
  </Icon>
)

/* Theme ------------------------------------------------------------------ */

export const MonitorIcon = (props: IconProps) => (
  <Icon strokeWidth={1.4} {...props}>
    <rect x="1.5" y="2.5" width="13" height="9" rx="1.5" />
    <path d="M5.5 14h5M8 11.5V14" />
  </Icon>
)

export const SunIcon = (props: IconProps) => (
  <Icon strokeWidth={1.4} {...props}>
    <circle cx="8" cy="8" r="3.1" />
    <path d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.8l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1" />
  </Icon>
)

export const MoonIcon = (props: IconProps) => (
  <Icon strokeWidth={1.4} {...props}>
    <path d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z" />
  </Icon>
)

/* Fields ------------------------------------------------------------------ */

export const EyeIcon = (props: IconProps) => (
  <Icon strokeWidth={1.4} {...props}>
    <path d="M1.5 8S4 3 8 3s6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5Z" />
    <circle cx="8" cy="8" r="2" />
  </Icon>
)

export const EyeOffIcon = (props: IconProps) => (
  <Icon strokeWidth={1.4} {...props}>
    <path d="M2.2 2.2l11.6 11.6" />
    <path d="M6.4 6.5A2 2 0 0 0 9.5 9.6" />
    <path d="M4 4.3C2.4 5.4 1.5 8 1.5 8s2.5 5 6.5 5c1.2 0 2.2-.4 3.1-1M9.9 3.2c-.6-.1-1.2-.2-1.9-.2-4 0-6.5 5-6.5 5" />
    <path d="M14.5 8s-.7 1.4-2.1 2.7" />
  </Icon>
)

/* Feedback ----------------------------------------------------------------- */

export const CheckIcon = (props: IconProps) => (
  <Icon strokeWidth={1.8} {...props}>
    <path d="M3 8.5 6.5 12l6.5-8" />
  </Icon>
)

export const AlertIcon = (props: IconProps) => (
  <Icon strokeWidth={1.5} {...props}>
    <path d="M8 1.8 14.7 13.5H1.3Z" />
    <path d="M8 6.2v3.4" />
    <path d="M8 12v.01" />
  </Icon>
)

export const InfoIcon = (props: IconProps) => (
  <Icon strokeWidth={1.5} {...props}>
    <circle cx="8" cy="8" r="6.3" />
    <path d="M8 7.2v4" />
    <path d="M8 4.9v.01" />
  </Icon>
)
