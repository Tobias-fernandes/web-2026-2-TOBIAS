import { Card, CardLink, CardTitle, QueryState, SkeletonRows } from '@/components/ui'
import type { Loadable } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import type { CashFlowSummary } from '@/domain/types'
import { formatMoney } from '@/lib/format'
import { cn } from '@/lib/utils'

/** The four lines of the management's cash, in the order money moves. */
function linesOf(cash: CashFlowSummary) {
  return [
    { label: 'Recebido', value: cash.receivedCents, alert: false },
    { label: 'Pago', value: cash.paidCents, alert: false },
    { label: 'A receber', value: cash.toReceiveCents, alert: false },
    {
      label: 'Vencido e não recebido',
      value: cash.overdueCents,
      alert: cash.overdueCents > 0,
    },
  ]
}

export function CashFlowCard({ query }: { query: Loadable<CashFlowSummary> }) {
  return (
    <Card>
      <CardTitle action={<CardLink to={ROUTES.app.finance}>Financeiro</CardLink>}>
        Caixa da gestão
      </CardTitle>

      <QueryState query={query} skeleton={<SkeletonRows />}>
        {(cash) => (
          <dl className="m-0 flex flex-col gap-3">
            {linesOf(cash).map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-3 border-b border-linha pb-2 last:border-0 last:pb-0"
              >
                <dt className="text-base leading-relaxed text-tinta-suave">
                  {line.label}
                </dt>
                <dd
                  className={cn('m-0 font-display font-bold', line.alert && 'text-ambar')}
                >
                  {formatMoney(line.value)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </QueryState>
    </Card>
  )
}
