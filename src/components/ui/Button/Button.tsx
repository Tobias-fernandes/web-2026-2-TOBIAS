import { cn } from "@/lib/utils";
import { BUTTON_BASE_CLASSES, BUTTON_VARIANT_CLASSES } from "./constants";
import type { ButtonProps } from "./types";

export function Button({
  variant = "solid",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        BUTTON_BASE_CLASSES,
        BUTTON_VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
