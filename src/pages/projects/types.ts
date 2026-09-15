import type { ProjectStatus } from '@/domain/types'

export interface ProjectFormState {
  name: string
  clientId: string
  ownerId: string
  scope: string
  stage: string
  status: ProjectStatus
  contractValue: string
  estimatedHours: string
  dueAt: string
}
