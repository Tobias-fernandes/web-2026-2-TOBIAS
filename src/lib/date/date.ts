import type { IsoDate } from "@/domain/types";
import { DAYS_IN_WEEK, MS_PER_DAY, WEEK_START_DAY } from "./constants";

/**
 * Date arithmetic on `YYYY-MM-DD` strings.
 *
 * The domain never carries a timestamp: a day of work is a day, and pushing it
 * through `new Date(iso)` parses it as UTC midnight, which lands on the previous
 * day for anyone west of Greenwich — every Brazilian user of this system. So the
 * parsing here is explicit and local, and everything that leaves this module is
 * a plain date string again.
 */
export function parseIsoDate(iso: IsoDate): Date {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function toIsoDate(date: Date): IsoDate {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Today as an ISO date (YYYY-MM-DD), the format used across the domain. */
export const todayIso = (): IsoDate => toIsoDate(new Date());

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round(
    (parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / MS_PER_DAY,
  );
}

/** Days left until the date — negative once it has passed. */
export const daysUntil = (iso: IsoDate): number => daysBetween(todayIso(), iso);

/** The Monday of the week the date falls in. */
export function startOfWeek(iso: IsoDate = todayIso()): IsoDate {
  const date = parseIsoDate(iso);
  const offset = (date.getDay() - WEEK_START_DAY + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  return addDays(iso, -offset);
}

/** The seven dates of the week starting on `monday`, Monday first. */
export function weekDates(monday: IsoDate): IsoDate[] {
  return Array.from({ length: DAYS_IN_WEEK }, (_, index) =>
    addDays(monday, index),
  );
}

/** The first day of the month the date falls in. */
export const startOfMonth = (iso: IsoDate = todayIso()): IsoDate =>
  `${iso.slice(0, 7)}-01`;

/** The last day of that month — 28, 29, 30 or 31, asked of the calendar. */
export function endOfMonth(iso: IsoDate): IsoDate {
  const date = parseIsoDate(iso);
  return toIsoDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

/**
 * Same day, `months` later or earlier — clamped to the end of the shorter month.
 *
 * Without the clamp, stepping forward from 31 January lands on 3 March, and the
 * month arrows on the calendar would skip February entirely.
 */
export function addMonths(iso: IsoDate, months: number): IsoDate {
  const date = parseIsoDate(iso);
  const shifted = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    shifted.getFullYear(),
    shifted.getMonth() + 1,
    0,
  ).getDate();
  shifted.setDate(Math.min(date.getDate(), lastDay));
  return toIsoDate(shifted);
}

export const isSameMonth = (a: IsoDate, b: IsoDate): boolean =>
  a.slice(0, 7) === b.slice(0, 7);

/**
 * Every cell of a month grid, Monday first, including the days borrowed from
 * the months on either side to square off the weeks.
 *
 * The number of rows follows the month instead of being fixed at six: a short
 * February that starts on a Monday would otherwise be drawn with two entirely
 * empty weeks under it.
 */
export function monthGrid(iso: IsoDate): IsoDate[] {
  const first = startOfWeek(startOfMonth(iso));
  const span = daysBetween(first, endOfMonth(iso)) + 1;
  const cells = Math.ceil(span / DAYS_IN_WEEK) * DAYS_IN_WEEK;
  return Array.from({ length: cells }, (_, index) => addDays(first, index));
}

/** Inclusive on both ends; an absent bound does not restrict. */
export function isWithinPeriod(
  date: IsoDate,
  from?: IsoDate,
  to?: IsoDate,
): boolean {
  if (from && date < from) return false;
  if (to && date > to) return false;
  return true;
}

/**
 * How much of a range has elapsed, 0-1.
 *
 * The pace the term's goals are compared against: 40% of the revenue goal is
 * good news in week 3 and bad news in week 14.
 */
export function elapsedShare(startsAt: IsoDate, endsAt: IsoDate): number {
  const total = daysBetween(startsAt, endsAt);
  if (total <= 0) return 1;
  const done = daysBetween(startsAt, todayIso());
  return Math.min(1, Math.max(0, done / total));
}

/**
 * Whether a range touches another. An absent bound does not restrict.
 *
 * Not the same question as `isWithinPeriod`: an event that opens in August and
 * closes in September belongs to both months, and asking whether its start date
 * falls inside September would drop it from that month's calendar.
 */
export function overlapsPeriod(
  startsAt: IsoDate,
  endsAt: IsoDate,
  from?: IsoDate,
  to?: IsoDate,
): boolean {
  if (to && startsAt > to) return false;
  if (from && endsAt < from) return false;
  return true;
}
