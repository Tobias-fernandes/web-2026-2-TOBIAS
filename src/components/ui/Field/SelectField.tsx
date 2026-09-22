import { useId } from "react";
import { cn } from "@/lib/utils";
import { FIELD_BASE_CLASSES } from "./constants";
import { FieldShell } from "./FieldShell";
import type { SelectFieldProps } from "./types";

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  hint,
  error,
  options,
  className,
  ...props
}) => {
  const id = useId();

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(FIELD_BASE_CLASSES, error && "border-ambar", className)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
};

export { SelectField };
