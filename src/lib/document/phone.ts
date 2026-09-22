import { onlyDigits } from "./document";

/**
 * Valid two-digit area codes under Brazil's numbering plan. Not every
 * two-digit number is one, so a wrong DDD is caught here the same way a bad
 * CPF check digit is — as a typo, not just an out-of-range guess.
 */
const VALID_DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35,
  37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64,
  65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88,
  89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/**
 * A landline has 8 local digits (10 total); a mobile has 9, and under the
 * numbering plan the first of those nine is always a 9 — a rule that has held
 * since the ninth-digit rollout finished in 2016, so it is checked, not
 * assumed.
 */
export function isValidBrPhone(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  if (!VALID_DDDS.has(Number(digits.slice(0, 2)))) return false;

  const localFirstDigit = digits[2];
  return digits.length === 11
    ? localFirstDigit === "9"
    : localFirstDigit !== "9" && localFirstDigit !== "0";
}

export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;

  // The hyphen sits after 4 digits for a landline, 5 for a mobile — which
  // only becomes knowable once the 11th digit is typed.
  const splitAt = digits.length > 10 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, splitAt)}-${rest.slice(splitAt)}`;
}
