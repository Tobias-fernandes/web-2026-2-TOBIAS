import type { FormDialogState, Loadable } from '@/components/ui'
import type {
  IsoDate,
  Member,
  Project,
  TimeEntry,
  TimeEntryCategory,
} from '@/domain/types'

export interface TimeEntryFormState {
  memberId: string
  category: TimeEntryCategory
  projectId: string
  date: string
  hours: string
  description: string
}

/** One line of the weekly grid: a project (or a category) across the seven days. */
export interface TimesheetRow {
  key: string
  label: string
  detail: string
  category: TimeEntryCategory
  projectId: string
  hoursByDate: Record<string, number>
  total: number
}

export interface TimesheetPageState {
  /** Directors and project managers may look at anyone's week. */
  seesEveryone: boolean
  /**
   * The signed-in account is not registered as a member of this EJ, so there is
   * no week that belongs to it and nothing it could log against.
   */
  unlinked: boolean
  members: Member[]
  projects: Project[]
  memberId: string
  setMemberId: (id: string) => void

  /** The seven dates on screen, Monday first. */
  days: IsoDate[]
  weekStart: IsoDate
  weekEnd: IsoDate
  today: IsoDate
  isCurrentWeek: boolean
  goToWeek: (offset: number) => void
  goToToday: () => void

  entries: Loadable<TimeEntry[]>
  /** The week's entries, oldest first. */
  weekEntries: TimeEntry[]
  /** One line per project or category, for the grid. */
  rows: TimesheetRow[]
  weekTotal: number
  /** Hours the member owes per week under their membership. */
  committed: number
  projectName: (id: string) => string
  memberName: (id: string) => string
  deleting: boolean
  removeEntry: (id: string) => void

  dialog: FormDialogState<TimeEntryFormState>
  openDialog: (overrides?: Partial<TimeEntryFormState>) => void
}
