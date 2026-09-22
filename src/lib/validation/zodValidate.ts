import type { ZodType } from "zod";

/**
 * Runs a zod schema and reduces it to the one message every form dialog in
 * the app expects — the first issue, in the order the schema raised it.
 *
 * Forms here show one complaint at a time next to the submit button, not a
 * message per field, so nothing is lost keeping only the first.
 */
export function zodValidate<T>(
  schema: ZodType<T>,
  value: unknown,
): string | null {
  const result = schema.safeParse(value);
  return result.success
    ? null
    : (result.error.issues[0]?.message ?? "Dados inválidos.");
}
