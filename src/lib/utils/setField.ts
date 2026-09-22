/**
 * Field setter for a controlled form object held one level up.
 *
 * `const set = setField(value, onChange)` then `set('name', next)`. Every form
 * component used to declare this same generic closure inline.
 */
export const setField =
  <T extends object>(value: T, onChange: (next: T) => void) =>
  <K extends keyof T>(key: K, fieldValue: T[K]) =>
    onChange({ ...value, [key]: fieldValue });
