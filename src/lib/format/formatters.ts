import {
  currencyFormatter,
  LOCALE,
  longDateFormatter,
  MS_PER_DAY,
  shortDateFormatter,
} from './constants'

/** Parses "2026-03-15" as a local date, avoiding the UTC shift of plain ISO. */
function parseDate(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export const formatCurrency = (value: number) => currencyFormatter.format(value)

export const formatDate = (iso: string) => shortDateFormatter.format(parseDate(iso))

export const formatLongDate = (iso: string) =>
  longDateFormatter.format(parseDate(iso))

export const formatHours = (hours: number) =>
  `${hours.toLocaleString(LOCALE, { maximumFractionDigits: 1 })} h`

export const formatPercent = (fraction: number) => `${Math.round(fraction * 100)}%`

/** Days left until the due date — negative once it has passed. */
export function daysUntil(iso: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseDate(iso).getTime() - today.getTime()) / MS_PER_DAY)
}

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

/** Today as an ISO date (YYYY-MM-DD), the format used across the domain. */
export const todayIso = () => new Date().toISOString().slice(0, 10)
