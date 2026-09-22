import { DEAL_FUNNEL_COLUMNS, DEAL_STAGE_LABELS } from '@/domain/constants'
import type { Deal, DealStage } from '@/domain/types'
import { formatMoney } from '@/lib/format'
import { DealCard } from './DealCard'

interface DealBoardProps {
  deals: Deal[]
  clientName: (id: string) => string
  memberName: (id: string) => string
  editable: boolean
  moving: boolean
  onAdvance: (deal: Deal, stage: DealStage) => void
  onLose: (deal: Deal) => void
}

/** The open stages, each column headed by what it is worth. */
export function DealBoard({
  deals,
  clientName,
  memberName,
  editable,
  moving,
  onAdvance,
  onLose,
}: DealBoardProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {DEAL_FUNNEL_COLUMNS.map((stage) => {
        const column = deals.filter((deal) => deal.stage === stage)
        const total = column.reduce((sum, deal) => sum + deal.valueCents, 0)

        return (
          <section
            key={stage}
            aria-label={DEAL_STAGE_LABELS[stage]}
            className="rounded-xl border border-linha bg-papel-alto p-3"
          >
            <div className="mb-3 flex items-baseline justify-between border-b border-linha px-1 pb-2">
              <h2 className="font-sans text-xs font-semibold text-tinta-suave">
                {DEAL_STAGE_LABELS[stage]}
              </h2>
              <span className="text-xs text-tinta-suave">{formatMoney(total)}</span>
            </div>

            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {column.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  clientName={clientName(deal.clientId)}
                  ownerName={memberName(deal.ownerId)}
                  editable={editable}
                  moving={moving}
                  onAdvance={(next) => onAdvance(deal, next)}
                  onLose={() => onLose(deal)}
                />
              ))}

              {column.length === 0 && (
                <li className="rounded-lg border border-dashed border-linha px-3 py-6 text-center text-sm text-tinta-suave">
                  Nada aqui ainda.
                </li>
              )}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
