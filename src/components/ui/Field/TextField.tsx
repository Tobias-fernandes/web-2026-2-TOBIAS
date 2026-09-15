import { useId } from 'react'
import { cn } from '@/lib/utils'
import { FIELD_BASE_CLASSES } from './constants'
import { FieldShell } from './FieldShell'
import type { TextFieldProps } from './types'

export function TextField({
  label,
  hint,
  error,
  className,
  ...props
}: TextFieldProps) {
  const id = useId()

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(FIELD_BASE_CLASSES, error && 'border-ambar', className)}
        {...props}
      />
    </FieldShell>
  )
}
