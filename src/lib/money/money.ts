import { CENTS_PER_UNIT } from './constants'

/**
 * Money is stored as an integer number of cents, never as a float.
 *
 * A contract split into three instalments is the everyday case here, and
 * `11500 / 3` in floating point does not add back up to the contract. Rounding
 * happens once, at the edge where a person types an amount.
 */
export const toCents = (amount: number): number =>
  Math.round(amount * CENTS_PER_UNIT)

export const fromCents = (cents: number): number => cents / CENTS_PER_UNIT

/**
 * Reads what a person typed into a currency field: "4.800,50", "4800.5", "4800".
 * Returns null when there is no number in it, so the form can say so.
 */
export function parseMoneyInput(text: string): number | null {
  const cleaned = text.trim().replace(/[^\d,.-]/g, '')
  if (!cleaned) return null

  // "4.800,50" is Brazilian; "4800.50" is what a number input produces. The
  // last separator in the string is the decimal one, whichever it is.
  const lastComma = cleaned.lastIndexOf(',')
  const lastDot = cleaned.lastIndexOf('.')
  const decimalAt = Math.max(lastComma, lastDot)

  const normalized =
    decimalAt === -1
      ? cleaned.replace(/[.,]/g, '')
      : `${cleaned.slice(0, decimalAt).replace(/[.,]/g, '')}.${cleaned.slice(decimalAt + 1)}`

  const value = Number(normalized)
  return Number.isFinite(value) ? toCents(value) : null
}
