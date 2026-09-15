import { useId } from 'react'
import { cn } from '@/lib/utils'
import { STATUS_SELECT_TONE_CLASSES } from './constants'
import type { StatusSelectProps } from './types'

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
          'rounded-[3px] border px-2 py-1 text-[0.76rem] font-semibold disabled:opacity-60',
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
