import { useId } from "react";
import { Select } from "../Select/Select";
import { FieldShell } from "./FieldShell";
import type { SelectFieldProps } from "./types";

/** A labelled `Select`, with the hint and error every field carries. */
const SelectField = <T extends string>({
  label,
  hint,
  error,
  ...select
}: SelectFieldProps<T>) => {
  const id = useId();

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <Select
        {...select}
        id={id}
        labelledBy={`${id}-label`}
        invalid={Boolean(error)}
      />
    </FieldShell>
  );
};

export { SelectField };
