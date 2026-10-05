import { cn } from "@/lib/utils";
import { Select } from "../Select/Select";
import { STATUS_SELECT_TONE_CLASSES } from "./constants";
import type { StatusSelectProps } from "./types";

/**
 * Status editable straight from a table row.
 *
 * The select itself carries the colour of the state, so the information is not
 * repeated in a separate badge next to it.
 */
const StatusSelect = <T extends string>({
  value,
  tone,
  accessibleLabel,
  options,
  disabled,
  onChange,
}: StatusSelectProps<T>) => (
  <Select
    value={value}
    options={options}
    onValueChange={onChange}
    disabled={disabled}
    size="compact"
    aria-label={accessibleLabel}
    className={cn(STATUS_SELECT_TONE_CLASSES[tone])}
  />
);

export { StatusSelect };
