import { Badge } from '@/components/ui'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_TONES } from '@/domain/constants'
import { cn } from '@/lib/utils'
import {
  BOARD_PREVIEW_COLUMNS,
  PREVIEW_ADDRESS,
  PREVIEW_METRICS,
} from './constants'

/**
 * Picture of the system, shown in the hero.
 *
 * Carries its own copy rather than reading the demo seed: the public page is
 * unauthenticated, must not fire an API call, and must not change shape every
 * time someone edits the demonstration data.
 */
export function AppPreview({ className }: { className?: string }) {
  return (
    <div
      aria-label="Exemplo do painel do sistema"
      className={cn(
        'overflow-hidden rounded-xl border border-linha bg-papel-alto shadow-[0_24px_60px_-30px_rgb(27_25_48/0.45)]',
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-linha bg-papel px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-linha" />
          <span className="size-2.5 rounded-full bg-linha" />
          <span className="size-2.5 rounded-full bg-linha" />
        </span>
        <span className="flex-1 truncate rounded-md border border-linha bg-papel-alto px-3 py-1 text-2xs text-tinta-suave">
          {PREVIEW_ADDRESS}
        </span>
      </div>

      <div className="grid gap-px bg-linha sm:grid-cols-3">
        {PREVIEW_METRICS.map((metric) => (
          <div key={metric.label} className="bg-papel-alto px-4 py-3.5">
            <p className="m-0 text-2xs text-tinta-suave">{metric.label}</p>
            <p className="m-0 mt-1 font-display text-lg font-bold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-linha p-4 sm:grid-cols-3">
        {BOARD_PREVIEW_COLUMNS.map((column) => (
          <div key={column.status}>
            <h3 className="mt-0 mb-2 font-sans text-2xs font-semibold text-tinta-suave">
              {PROJECT_STATUS_LABELS[column.status]}
            </h3>
            <div className="flex flex-col gap-2">
              {column.cards.map((card) => (
                <div
                  key={card.name}
                  className="rounded-lg border border-linha bg-papel p-2.5"
                >
                  <p className="m-0 mb-2 text-xs font-semibold">{card.name}</p>
                  <Badge tone={PROJECT_STATUS_TONES[column.status]}>
                    {card.stage}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
