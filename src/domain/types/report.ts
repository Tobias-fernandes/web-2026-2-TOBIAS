import type { ID } from './common'
import type { MemberRole } from './member'

/** Consolidated figures behind the dashboard and the end-of-term report. */
export interface DashboardMetrics {
  projectsInProgress: number
  projectsDelivered: number
  projectsProspecting: number
  activeMembers: number
  activeClients: number
  loggedHours: number
  contractedRevenue: number
  realizedRevenue: number
}

export interface MemberHours {
  memberId: ID
  name: string
  role: MemberRole
  hours: number
  /** Share of the committed weekly load that was actually logged. */
  utilization: number
}

export interface ProjectHours {
  projectId: ID
  name: string
  hours: number
  estimatedHours: number
}
