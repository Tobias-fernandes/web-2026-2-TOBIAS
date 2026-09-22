import { Note, ProgressBar } from '@/components/ui'
import {
  TIME_ENTRY_CATEGORY_LABELS,
  TIME_ENTRY_CATEGORY_TONES,
} from '@/domain/constants'
import type { HoursByCategory } from '@/domain/types'
import { formatHours, formatPercent } from '@/lib/format'

export interface CategoryBreakdownProps {
  rows: HoursByCategory[]
}

/**
 * Where the term's hours went.
 *
 * The share of non-project work is the number that explains why a team that
 * "did nothing" delivered two contracts: it was running the enterprise.
 */
export function CategoryBreakdown({ rows }: CategoryBreakdownProps) {
  const billable = rows.find((row) => row.category === 'project')

  return (
    <>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {rows.map((row) => (
          <li key={row.category}>
            <ProgressBar
              ratio={row.share}
              tone={TIME_ENTRY_CATEGORY_TONES[row.category]}
              label={TIME_ENTRY_CATEGORY_LABELS[row.category]}
              value={`${formatHours(row.hours)} · ${formatPercent(row.share)}`}
            />
          </li>
        ))}
      </ul>

      {billable && (
        <Note>
          {formatPercent(1 - billable.share)} das horas da gestão não foram horas de
          projeto. É o custo real de manter a EJ funcionando.
        </Note>
      )}
    </>
  )
}
