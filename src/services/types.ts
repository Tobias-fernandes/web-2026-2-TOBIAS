import type {
  Client,
  CreateInput,
  DashboardMetrics,
  ID,
  Member,
  MemberHours,
  Project,
  ProjectHours,
  ProjectStatus,
  TimeEntry,
} from '@/domain/types'

/**
 * Data layer contracts.
 *
 * Implemented twice: by `src/services/mock` (demo data, what runs today) and by
 * `src/services/aws` (HTTP calls to the API). The query hooks only know these
 * interfaces, so switching sources touches no component — only VITE_DATA_SOURCE.
 */

export interface CrudRepository<T extends { id: ID }> {
  list(): Promise<T[]>
  get(id: ID): Promise<T | null>
  create(input: CreateInput<T>): Promise<T>
  update(id: ID, input: Partial<T>): Promise<T>
  remove(id: ID): Promise<void>
}

export type ClientRepository = CrudRepository<Client>

export type MemberRepository = CrudRepository<Member>

export interface ProjectRepository extends CrudRepository<Project> {
  /** Moves a project across board columns without sending the whole record. */
  changeStatus(id: ID, status: ProjectStatus): Promise<Project>
}

export interface TimeEntryFilter {
  memberId?: ID
  projectId?: ID
  from?: string
  to?: string
}

export interface TimeEntryRepository extends CrudRepository<TimeEntry> {
  listBy(filter: TimeEntryFilter): Promise<TimeEntry[]>
}

export interface ReportPeriod {
  from?: string
  to?: string
}

export interface ReportService {
  dashboardMetrics(period?: ReportPeriod): Promise<DashboardMetrics>
  hoursByMember(period?: ReportPeriod): Promise<MemberHours[]>
  hoursByProject(period?: ReportPeriod): Promise<ProjectHours[]>
}

export interface DataLayer {
  clients: ClientRepository
  members: MemberRepository
  projects: ProjectRepository
  timeEntries: TimeEntryRepository
  reports: ReportService
}
