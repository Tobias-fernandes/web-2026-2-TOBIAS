import type { SpinnerProps } from './types'

export function Spinner({ label = 'Carregando…' }: SpinnerProps) {
  return (
    <p role="status" className="flex items-center gap-2.5 text-sm text-tinta-suave">
      <span
        aria-hidden
        className="size-4 animate-spin rounded-full border-2 border-linha border-t-violeta"
      />
      {label}
    </p>
  )
}
