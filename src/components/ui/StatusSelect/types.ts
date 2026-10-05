import type { Tone } from "@/domain/constants";

import type { SelectOption } from "../Select/types";

export type StatusOption<T extends string> = SelectOption<T>;

export interface StatusSelectProps<T extends string> {
  value: T;
  tone: Tone;
  /** Announced to screen readers, since the visible label is the value itself. */
  accessibleLabel: string;
  options: StatusOption<T>[];
  disabled?: boolean;
  onChange: (value: T) => void;
}
