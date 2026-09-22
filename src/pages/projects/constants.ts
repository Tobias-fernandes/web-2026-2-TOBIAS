import { todayIso } from '@/lib/date'
import type { ProjectFormState } from './types'

export const buildEmptyProjectForm = (): ProjectFormState => ({
  name: '',
  clientId: '',
  ownerId: '',
  scope: '',
  stage: '',
  status: 'planning',
  contractValue: '',
  estimatedHours: '',
  startedAt: todayIso(),
  dueAt: '',
})

/** Hours logged over hours budgeted above this is called out on the card. */
export const BUDGET_ALERT_USAGE = 0.9
