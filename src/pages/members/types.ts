import type { MemberRole, MemberStatus } from '@/domain/types'

export interface MemberFormState {
  name: string
  email: string
  role: MemberRole
  course: string
  status: MemberStatus
  weeklyHours: string
  joinedAt: string
}
