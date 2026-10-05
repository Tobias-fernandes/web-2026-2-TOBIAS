export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string> {
  value: T;
  options: readonly SelectOption<T>[];
  onValueChange: (value: T) => void;
  /**
   * Shown, muted, while `value` matches no option — "Selecione…" on a field
   * that must be filled. Not an option: it cannot be picked back.
   */
  placeholder?: string;
  disabled?: boolean;
  /** Draws the trigger in the error colour, beside a field's error message. */
  invalid?: boolean;
  /** `field` fills a form column; `compact` sits inside a table row. */
  size?: "field" | "compact";
  /** Classes for the trigger, where the width and a tone are set. */
  className?: string;
  id?: string;
  /** Id of the visible label, which also names the list when it opens. */
  labelledBy?: string;
  /** For a select with no visible label, such as one inside a table row. */
  "aria-label"?: string;
}
