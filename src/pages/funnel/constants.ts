import { addDays, todayIso } from '@/lib/date'
import type { DealFormState } from './types'

export const buildEmptyDealForm = (): DealFormState => ({
  title: '',
  clientId: '',
  ownerId: '',
  stage: 'qualification',
  source: 'inbound',
  value: '',
  expectedCloseAt: addDays(todayIso(), 30),
  notes: '',
})

export const SOURCE_TABLE_HEADERS = [
  'Origem',
  'Oportunidades',
  'Ganhas',
  'Conversão',
  'Valor ganho',
]
