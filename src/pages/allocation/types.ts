import type { FormDialogState, Loadable } from '@/components/ui'
import type {
  Allocation,
  Member,
  MemberWorkload,
  Project,
} from '@/domain/types'

export interface AllocationFormState {
  memberId: string
  projectId: string
  weeklyHours: string
  startsAt: string
  endsAt: string
}

export interface AllocationPageState {
  editable: boolean
  workload: Loadable<MemberWorkload[]>
  allocations: Loadable<Allocation[]>
  members: Member[]
  /** Projects still consuming time, which are the ones worth allocating to. */
  openProjects: Project[]
  memberName: (id: string) => string
  projectName: (id: string) => string
  /** People whose allocations already exceed what they committed to. */
  overloaded: MemberWorkload[]
  /** People who are in no project at all — the ones who quietly drift away. */
  idle: MemberWorkload[]
  removing: boolean
  removeAllocation: (id: string) => void
  dialog: FormDialogState<AllocationFormState>
  openDialog: () => void
}
