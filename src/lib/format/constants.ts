export const LOCALE = 'pt-BR'

export const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

/** Used where the cents matter — an instalment, a reimbursement. */
export const exactCurrencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
})

export const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const dayMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
})

export const weekdayFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'short',
})

export const monthYearFormatter = new Intl.DateTimeFormat(LOCALE, {
  month: 'long',
  year: 'numeric',
})

export const weekdayLongFormatter = new Intl.DateTimeFormat(LOCALE, {
  weekday: 'long',
})

/** "15 de setembro" — the heading over a single day's commitments. */
export const dayMonthLongFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: 'numeric',
  month: 'long',
})
