import { Badge } from '@/components/ui'
import { DEAL_FUNNEL_COLUMNS, DEAL_SOURCE_LABELS } from '@/domain/constants'
import type { Deal, DealStage } from '@/domain/types'
import { formatDate, formatMoney } from '@/lib/format'

/** Next column on the funnel; the last open stage has nowhere left to advance. */
function nextStage(stage: DealStage): DealStage | null {
  const index = DEAL_FUNNEL_COLUMNS.indexOf(stage)
  return index >= 0 && index < DEAL_FUNNEL_COLUMNS.length - 1
    ? DEAL_FUNNEL_COLUMNS[index + 1]
    : null
}

const ACTION =
  'rounded-md border border-linha bg-papel-alto px-2 py-1.5 text-xs text-tinta-suave disabled:opacity-55'

interface DealCardProps {
  deal: Deal
  clientName: string
  ownerName: string
  editable: boolean
  moving: boolean
  onAdvance: (stage: DealStage) => void
  onLose: () => void
}

export function DealCard({
  deal,
  clientName,
  ownerName,
  editable,
  moving,
  onAdvance,
  onLose,
}: DealCardProps) {
  const next = nextStage(deal.stage)

  return (
    <li className="rounded-lg border border-linha bg-papel p-3">
      <p className="m-0 font-semibold">{deal.title}</p>
      <p className="m-0 mt-0.5 text-sm text-tinta-suave">{clientName}</p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <Badge tone="violet">{formatMoney(deal.valueCents)}</Badge>
        <Badge tone="neutral">{DEAL_SOURCE_LABELS[deal.source]}</Badge>
      </div>

      <p className="mt-2.5 mb-0 text-xs text-tinta-suave">
        {ownerName} · previsão {formatDate(deal.expectedCloseAt)}
      </p>

      {editable && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {next && (
            <button
              type="button"
              disabled={moving}
              onClick={() => onAdvance(next)}
              className={`${ACTION} flex-1 hover:border-violeta hover:text-violeta`}
            >
              Avançar
            </button>
          )}
          <button
            type="button"
            disabled={moving}
            onClick={() => onAdvance('won')}
            className={`${ACTION} hover:border-verde hover:text-verde`}
          >
            Ganhar
          </button>
          <button
            type="button"
            disabled={moving}
            onClick={onLose}
            className={`${ACTION} hover:border-ambar hover:text-ambar`}
          >
            Perder
          </button>
        </div>
      )}
    </li>
  )
}
