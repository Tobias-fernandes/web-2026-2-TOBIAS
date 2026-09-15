import type { FieldShellProps } from './types'

/** Label, hint and error wrapper shared by every field variant. */
export function FieldShell({
  id,
  label,
  hint,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.82rem] font-semibold text-tinta">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[0.78rem] text-ambar">{error}</p>
      ) : (
        hint && <p className="text-[0.78rem] text-tinta-suave">{hint}</p>
      )}
    </div>
  )
}
