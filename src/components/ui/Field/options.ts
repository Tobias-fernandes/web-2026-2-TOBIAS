/**
 * Builders for `<SelectField>` / `<StatusSelect>` option lists.
 *
 * Both shapes were written out at a dozen call sites, and the label one carried
 * an `as Status[]` cast every time — `Object.keys` widens to `string[]`. Casting
 * once here keeps the key type on the way out, so the call sites stay honest.
 */
export const labelOptions = <K extends string>(
  labels: Record<K, string>,
): { value: K; label: string }[] =>
  (Object.keys(labels) as K[]).map((value) => ({
    value,
    label: labels[value],
  }));

/** Options for picking a record: its id as the value, its name as the label. */
export const nameOptions = (
  items: readonly { id: string; name: string }[],
): { value: string; label: string }[] =>
  items.map(({ id, name }) => ({ value: id, label: name }));
