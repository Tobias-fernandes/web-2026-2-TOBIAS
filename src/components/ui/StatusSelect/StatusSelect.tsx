import { useId } from 'react'
import type { Tone } from '@/domain/constants'
import { cn } from '@/lib/utils'
import { STATUS_SELECT_TONE_CLASSES } from './constants'

export interface StatusOption<T extends string> {
  value: T
  label: string
}

export interface StatusSelectProps<T extends string> {
  value: T
  tone: Tone
  /** Announced to screen readers, since the visible label is the value itself. */
  accessibleLabel: string
  options: StatusOption<T>[]
  disabled?: boolean
  onChange: (value: T) => void
}

/**
 * Status editable straight from a table row.
 *
 * The select itself carries the colour of the state, so the information is not
 * repeated in a separate badge next to it.
 */
export function StatusSelect<T extends string>({
  value,
  tone,
  accessibleLabel,
  options,
  disabled,
  onChange,
}: StatusSelectProps<T>) {
  const id = useId()

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        {accessibleLabel}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        className={cn(
          'rounded-md border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-60',
          STATUS_SELECT_TONE_CLASSES[tone],
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}
