import type { SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Edge length in pixels. Line weight is tuned for 14–18. */
  size?: number;
}
