import type {} from "react";
import type {} from "@/domain/constants";
import { cn } from "@/lib/utils";
import { BADGE_TONE_CLASSES } from "./constants";
import type { BadgeProps } from "./types";

const Badge: React.FC<BadgeProps> = ({
  children,
  tone = "violet",
  className,
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-2xs font-semibold",
        BADGE_TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
};

export { Badge };
