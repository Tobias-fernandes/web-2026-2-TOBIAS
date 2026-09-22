import { buildEmptyCycleGoalsForm } from '@/lib/cycleGoals'
import { todayIso } from '@/lib/date'
import type { CycleFormState } from './types'

export const buildEmptyCycleForm = (): CycleFormState => ({
  startsAt: todayIso(),
  status: 'planned',
  ...buildEmptyCycleGoalsForm(),
})

export const CYCLES_TABLE_HEADERS = [
  'Gestão',
  'Período',
  'Meta de faturamento',
  'Meta de projetos',
  'Meta de membros',
  'Situação',
]
