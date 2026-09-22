import { MetricCard, QueryState, SkeletonMetrics } from '@/components/ui'
import type { Loadable } from '@/components/ui'
import { LOSS_REASON_LABELS } from '@/domain/constants'
import type { FunnelSummary } from '@/domain/types'
import { formatMoney, formatPercent } from '@/lib/format'

/** The four figures that summarise the commercial year. */
export function FunnelSummaryRow({
  summary,
  openCount,
}: {
  summary: Loadable<FunnelSummary>
  openCount: number
}) {
  return (
    <QueryState
      query={summary}
      skeleton={<SkeletonMetrics label="Consolidando o funil…" />}
    >
      {(data) => {
        const topReason = data.lossReasons[0]

        return (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Em aberto"
              value={formatMoney(data.openValueCents)}
              hint={`${openCount} negociação(ões) em andamento`}
            />
            <MetricCard
              label="Ganho na gestão"
              value={formatMoney(data.wonValueCents)}
              hint={`Conversão de ${formatPercent(data.conversion)}`}
            />
            <MetricCard
              label="Tempo médio de fechamento"
              value={
                data.averageDaysToClose !== null
                  ? `${data.averageDaysToClose} dias`
                  : '—'
              }
              hint="Do primeiro contato até ganhar ou perder"
            />
            <MetricCard
              label="Motivo de perda mais comum"
              value={topReason ? LOSS_REASON_LABELS[topReason.reason] : '—'}
              hint={
                topReason
                  ? `${topReason.count} negociação(ões)`
                  : 'Nenhuma perda registrada'
              }
            />
          </div>
        )
      }}
    </QueryState>
  )
}
