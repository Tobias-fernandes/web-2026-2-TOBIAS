import { useId } from "react";
import { cn } from "@/lib/utils";
import { FIELD_BASE_CLASSES } from "./constants";
import { FieldShell } from "./FieldShell";
import type { TextAreaFieldProps } from "./types";

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  hint,
  error,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        rows={3}
        aria-invalid={error ? true : undefined}
        className={cn(
          FIELD_BASE_CLASSES,
          "resize-y",
          error && "border-ambar",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
};

export { TextAreaField };
