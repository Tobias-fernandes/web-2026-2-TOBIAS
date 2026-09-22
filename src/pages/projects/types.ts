import type { FormDialogState, Loadable } from '@/components/ui'
import type {
  Client,
  Member,
  Project,
  ProjectMargin,
  ProjectStatus,
} from '@/domain/types'

export interface ProjectFormState {
  name: string
  clientId: string
  ownerId: string
  scope: string
  stage: string
  status: ProjectStatus
  /** Typed in reais and converted to cents on submit. */
  contractValue: string
  estimatedHours: string
  startedAt: string
  dueAt: string
}

export interface ProjectsPageState {
  editable: boolean
  projects: Loadable<Project[]>
  clients: Client[]
  members: Member[]
  clientName: (id: string) => string
  memberName: (id: string) => string
  /** The margin of each project, by id, or undefined while it loads. */
  marginOf: (projectId: string) => ProjectMargin | undefined
  moving: boolean
  move: (project: Project, status: ProjectStatus) => void
  dialog: FormDialogState<ProjectFormState>
  openDialog: () => void
}
