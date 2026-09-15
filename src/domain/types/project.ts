import type { ID } from './common'

export type ProjectStatus =
  | 'prospecting'
  | 'inProgress'
  | 'delivered'
  | 'cancelled'

export interface Project {
  id: ID
  name: string
  clientId: ID
  ownerId: ID
  teamIds: ID[]
  scope: string
  status: ProjectStatus
  /** Short label shown on the board card: "Sprint 3 de 5", "Proposta enviada"… */
  stage: string
  contractValue: number
  estimatedHours: number
  startedAt: string
  dueAt: string
  closedAt: string | null
}
