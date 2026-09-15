import type { ProjectFormState } from './types'

export const EMPTY_PROJECT_FORM: ProjectFormState = {
  name: '',
  clientId: '',
  ownerId: '',
  scope: '',
  stage: '',
  status: 'prospecting',
  contractValue: '',
  estimatedHours: '',
  dueAt: '',
}
