import type { ReactNode } from 'react'
import type { Tone } from '@/domain/constants'
import { cn } from '@/lib/utils'
import { PROGRESS_FILL_CLASSES } from './constants'

export interface ProgressBarProps {
  /** 0-1. Values above 1 fill the bar and are reported in the label, not clipped. */
  ratio: number
  label?: ReactNode
  value?: ReactNode
  tone?: Tone
  /**
   * Second, thinner marker under the bar — the pace the term is running at, so a
   * goal can be read as ahead or behind instead of just "40%".
   */
  reference?: number
  referenceLabel?: string
  className?: string
}

export function ProgressBar({
  ratio,
  label,
  value,
  tone = 'violet',
  reference,
  referenceLabel,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round(ratio * 100)))

  return (
    <div className={className}>
      {(label || value) && (
        <div className="mb-1 flex items-baseline justify-between gap-3 text-base">
          <span className="min-w-0 truncate">{label}</span>
          <span className="shrink-0 text-tinta-suave">{value}</span>
        </div>
      )}

      <div
        className="relative h-1.5 overflow-hidden rounded-full bg-papel"
        role="img"
        aria-label={`${percent}% concluído`}
      >
        <div
          className={cn('h-full rounded-full', PROGRESS_FILL_CLASSES[tone])}
          style={{ width: `${percent}%` }}
        />
        {reference !== undefined && (
          <span
            aria-hidden
            title={referenceLabel}
            className="absolute inset-y-0 w-px bg-tinta"
            style={{ left: `${Math.min(100, Math.max(0, reference * 100))}%` }}
          />
        )}
      </div>
    </div>
  )
}
