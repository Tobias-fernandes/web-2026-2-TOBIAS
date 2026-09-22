import { todayIso } from '@/lib/date'
import type { FinanceFilterState, FinanceFormState } from './types'

export const buildEmptyFinanceForm = (): FinanceFormState => ({
  kind: 'receivable',
  category: 'projectInstalment',
  description: '',
  amount: '',
  dueAt: todayIso(),
  settled: false,
  directorate: 'finance',
  memberId: '',
  receiptRef: '',
  projectId: '',
  clientId: '',
})

export const EMPTY_FINANCE_FILTER: FinanceFilterState = {
  kind: '',
  settlement: '',
}

export const FINANCE_TABLE_HEADERS = [
  'Vencimento',
  'Descrição',
  'Categoria',
  'Área',
  'Valor',
  'Situação',
  '',
]
