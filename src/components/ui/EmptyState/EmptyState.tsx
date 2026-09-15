import type { EmptyStateProps } from './types'

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-linha bg-papel-alto px-6 py-10 text-center">
      <p className="font-display font-bold text-tinta">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-[46ch] text-sm text-tinta-suave">
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}
