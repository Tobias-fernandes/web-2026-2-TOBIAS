import { daysUntil, parseIsoDate } from '@/lib/date'
import { fromCents } from '@/lib/money'
import {
  currencyFormatter,
  dayMonthFormatter,
  dayMonthLongFormatter,
  exactCurrencyFormatter,
  LOCALE,
  monthYearFormatter,
  shortDateFormatter,
  weekdayFormatter,
  weekdayLongFormatter,
} from './constants'

/** Amounts arrive in cents; only the formatters here turn them back into reais. */
export const formatMoney = (cents: number) =>
  currencyFormatter.format(fromCents(cents))

/** Same, keeping the cents visible — for instalments and reimbursements. */
export const formatExactMoney = (cents: number) =>
  exactCurrencyFormatter.format(fromCents(cents))

export const formatDate = (iso: string) => shortDateFormatter.format(parseIsoDate(iso))

export const formatDayMonth = (iso: string) =>
  dayMonthFormatter.format(parseIsoDate(iso))

export const formatWeekday = (iso: string) =>
  weekdayFormatter.format(parseIsoDate(iso)).replace('.', '')

export const formatHours = (hours: number) =>
  `${hours.toLocaleString(LOCALE, { maximumFractionDigits: 1 })} h`

export const formatPercent = (fraction: number) => `${Math.round(fraction * 100)}%`

/** Client satisfaction, shown as "8,7 / 10" rather than a bare number. */
export const formatScore = (score: number) =>
  `${score.toLocaleString(LOCALE, { maximumFractionDigits: 1 })} / 10`

/** Short due-date label used on the project board cards. */
export function formatDueLabel(iso: string): string {
  const days = daysUntil(iso)
  if (days < 0) return `Atrasado ${Math.abs(days)} d`
  if (days === 0) return 'Vence hoje'
  if (days === 1) return 'Vence amanhã'
  return `Prazo em ${days} d`
}

/** Two-letter avatar initials. */
export const getInitials = (name: string) =>
  name
    .split(' ')
    .filter((part) => part.length > 2 || part === part.toUpperCase())
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

/** Portuguese names the months in lower case; a heading wants the capital. */
const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** "Setembro de 2026" — the calendar's month heading. */
export const formatMonthYear = (iso: string) =>
  capitalise(monthYearFormatter.format(parseIsoDate(iso)))

export const formatWeekdayLong = (iso: string) =>
  capitalise(weekdayLongFormatter.format(parseIsoDate(iso)))

export const formatDayMonthLong = (iso: string) =>
  dayMonthLongFormatter.format(parseIsoDate(iso))

/**
 * When a commitment happens: "19:00 – 20:30", or "Dia todo" when it has no hour.
 *
 * An all-day event has no times at all rather than 00:00–23:59, so the absence
 * is what this reads — there is no hour to print.
 */
export function formatTimeRange(start: string | null, end: string | null): string {
  if (!start) return 'Dia todo'
  return end ? `${start} – ${end}` : start
}

/**
 * "03/02/2025 — 19/12/2025", ou o fim em aberto enquanto ainda está correndo.
 *
 * A gestão em andamento não tem data de fim: o dia da passagem de bastão só é
 * conhecido quando chega, e imprimir uma data inventada no lugar seria pior que
 * dizer que ela não existe.
 */
export const formatPeriod = (startsAt: string, endsAt: string | null) =>
  `${formatDate(startsAt)} — ${endsAt ? formatDate(endsAt) : 'em andamento'}`
