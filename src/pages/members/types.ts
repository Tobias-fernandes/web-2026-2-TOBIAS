import type { FormDialogState, Loadable } from '@/components/ui'
import type {
  Course,
  ID,
  Member,
  MemberRole,
  MemberStatus,
  Membership,
  WorkArea,
} from '@/domain/types'

export interface MemberFormState {
  name: string
  email: string
  phone: string
  cpf: string
  registration: string
  /** Term the person started the degree in, as `2023.1`. */
  entryTerm: string
  courseId: ID
  avatarUrl: string | null
  status: MemberStatus
  joinedAt: string
  /** Fields of the membership created together with the person. */
  role: MemberRole
  workAreaId: ID
  weeklyHours: string
}

export interface MembersPageState {
  editable: boolean
  description: string
  /** The roster waits on both reads, because a row needs the two of them. */
  roster: Loadable<Member[]>
  /** The current board first, then everyone who is only history. */
  rows: Member[]
  membershipOf: (memberId: string) => Membership | undefined
  hoursOf: (memberId: string) => number
  /** Courses and areas this EJ registered; the form offers these and no others. */
  courses: Course[]
  workAreas: WorkArea[]
  courseName: (courseId: ID) => string
  workAreaName: (workAreaId: ID) => string
  updating: boolean
  changeStatus: (member: Member, status: MemberStatus) => void
  dialog: FormDialogState<MemberFormState>
  cycleName: string
}
