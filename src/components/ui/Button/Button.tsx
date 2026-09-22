import { cn } from "@/lib/utils";
import { BUTTON_BASE_CLASSES, BUTTON_VARIANT_CLASSES } from "./constants";
import type { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({
  variant = "solid",
  className,
  children,
  ...props
}) => {
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
};

export { Button };
