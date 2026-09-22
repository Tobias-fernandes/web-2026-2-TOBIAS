import type { ReactNode } from 'react'
import type { ReportPeriodState } from './types'

export const buildEmptyPeriod = (cycleId: string): ReportPeriodState => ({
  cycleId,
  from: '',
  to: '',
})

export const MARGIN_HEADERS = [
  'Projeto',
  'Cliente',
  'Contrato',
  'Horas orçadas',
  'Horas lançadas',
  'Consumo',
  'Hora orçada',
  'Hora real',
]

export const WORKLOAD_HEADERS = [
  'Membro',
  'Cargo',
  'Pactuado',
  'Alocado',
  'Lançadas',
  'Aproveitamento',
]

/** Shown by every table here when the chosen period has nothing in it. */
export const NO_ENTRIES: ReactNode = (
  <p className="m-0 text-sm text-tinta-suave">
    Sem lançamentos no período selecionado.
  </p>
)
