import { useId, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { FIELD_BASE_CLASSES } from './constants'
import { FieldShell } from './FieldShell'
import type { TextFieldProps } from './types'

export function TextField({
  label,
  hint,
  error,
  className,
  type,
  ...props
}: TextFieldProps) {
  const id = useId()
  const [visible, setVisible] = useState(false)
  const isPassword = type === 'password'

  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? 'text' : type}
          aria-invalid={error ? true : undefined}
          className={cn(
            FIELD_BASE_CLASSES,
            isPassword && 'pr-10',
            error && 'border-ambar',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-tinta-suave hover:text-tinta"
          >
            {visible ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
          </button>
        )}
      </div>
    </FieldShell>
  )
}
