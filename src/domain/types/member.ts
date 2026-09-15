import type { ID } from './common'

/** Position held inside the junior enterprise. Drives permissions and reports. */
export type MemberRole =
  | 'president'
  | 'director'
  | 'manager'
  | 'consultant'
  | 'trainee'

export type MemberStatus = 'active' | 'onLeave' | 'inactive'

export interface Member {
  id: ID
  name: string
  email: string
  role: MemberRole
  course: string
  status: MemberStatus
  joinedAt: string
  /** Weekly hours the member committed to. Used to measure utilization. */
  weeklyHours: number
}
