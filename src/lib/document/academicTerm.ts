import type { AcademicTerm } from "@/domain/types";

/** Universities number semesters 1 and 2; there is no `2023.3`. */
const TERM_PATTERN = /^(\d{4})\.([12])$/;

/** Nobody enrolled before the first Brazilian university, and none in the future. */
const EARLIEST_YEAR = 1900;

export function isValidAcademicTerm(value: string): boolean {
  const match = TERM_PATTERN.exec(value.trim());
  if (!match) return false;

  const year = Number(match[1]);
  return year >= EARLIEST_YEAR && year <= new Date().getFullYear();
}

/**
 * Normalises what people type into `YYYY.S`.
 *
 * `2023/1`, `2023-1` and `20231` all mean the same term to the person typing
 * it, and rejecting them teaches nothing — the form would only be asking for a
 * punctuation mark.
 */
export function formatAcademicTerm(value: string): AcademicTerm {
  const digits = value.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}.${digits.slice(4)}`;
}
