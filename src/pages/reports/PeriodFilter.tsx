import { Button, Card, SelectField, TextField } from '@/components/ui'
import { describeCycle } from '@/domain/constants'
import type { ReportsPageState } from './types'

type PeriodFilterProps = Pick<
  ReportsPageState,
  'cycles' | 'period' | 'setPeriod' | 'resetPeriod'
>

/** Which management the report covers, and optionally which slice of it. */
export function PeriodFilter({
  cycles,
  period,
  setPeriod,
  resetPeriod,
}: PeriodFilterProps) {
  return (
    <Card className="mb-5 p-4 print:hidden">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <SelectField
          label="Gestão"
          value={period.cycleId}
          options={cycles.map((cycle) => ({
            value: cycle.id,
            label: describeCycle(cycle),
          }))}
          onChange={(event) =>
            setPeriod({ ...period, cycleId: event.target.value })
          }
        />
        <TextField
          label="Início do período"
          type="date"
          value={period.from}
          onChange={(event) => setPeriod({ ...period, from: event.target.value })}
        />
        <TextField
          label="Fim do período"
          type="date"
          value={period.to}
          onChange={(event) => setPeriod({ ...period, to: event.target.value })}
        />
        <Button variant="subtle" onClick={resetPeriod}>
          Gestão inteira
        </Button>
      </div>

      <p className="mt-4 mb-0 text-xs leading-relaxed text-tinta-suave">
        O período é opcional: sem ele o relatório cobre a gestão inteira, que é o
        recorte usado na prestação de contas.
      </p>
    </Card>
  )
}
