import { PageHeader } from '@/components/layout'
import { CategoryBreakdown } from '@/components/reports'
import {
  Button,
  Card,
  CardTitle,
  ListState,
  SkeletonBars,
} from '@/components/ui'
import { NO_ENTRIES } from './constants'
import { MarginTable } from './MarginTable'
import { PeriodFilter } from './PeriodFilter'
import { SummaryCard } from './SummaryCard'
import { WorkloadTable } from './WorkloadTable'
import { useReportsPage } from './hooks'

/**
 * The end-of-term report, on screen.
 *
 * Printable on purpose: what a junior enterprise has to hand over at the end of
 * a management is exactly this — what was sold, what was delivered, how many
 * hours it cost and who gave them.
 */
export function ReportsPage() {
  const report = useReportsPage()


  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Os números da gestão já somados: faturamento, entregas, margem por projeto e horas por pessoa."
        action={
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir / salvar PDF
          </Button>
        }
      />

      <PeriodFilter
        cycles={report.cycles}
        period={report.period}
        setPeriod={report.setPeriod}
        resetPeriod={report.resetPeriod}
      />

      <SummaryCard metrics={report.metrics} cycleName={report.cycleName} />

      <MarginTable margins={report.margins} />

      <div className="mt-10 grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="mt-0 mb-4 font-display text-lg font-bold">
            Horas por membro
          </h2>
          <WorkloadTable workload={report.workload} />
        </div>

        <Card>
          <CardTitle>Para onde foram as horas</CardTitle>
          <ListState
            query={report.categories}
            rows={report.categories.data ?? []}
            skeleton={<SkeletonBars count={5} />}
            empty={NO_ENTRIES}
          >
            {(rows) => <CategoryBreakdown rows={rows} />}
          </ListState>
        </Card>
      </div>
    </>
  )
}
