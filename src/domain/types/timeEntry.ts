import type { ID } from './common'

export interface TimeEntry {
  id: ID
  memberId: ID
  projectId: ID
  date: string
  hours: number
  description: string
}
