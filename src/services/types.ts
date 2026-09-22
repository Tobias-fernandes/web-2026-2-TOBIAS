import type {
  Allocation,
  CalendarEvent,
  CashFlowSummary,
  Client,
  Course,
  CreateInput,
  Cycle,
  CycleProgress,
  DashboardMetrics,
  Deal,
  DealStage,
  Directorate,
  EventKind,
  FinanceEntry,
  FunnelSummary,
  HoursByCategory,
  ID,
  IsoDate,
  JuniorEnterprise,
  Member,
  Membership,
  MemberWorkload,
  Project,
  ProjectMargin,
  ProjectStatus,
  TimeEntry,
  WorkArea,
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

export type CycleRepository = CrudRepository<Cycle>

/**
 * Admitting someone creates two records: the person and the position they take
 * in the current management. They travel together because a member with no
 * membership is invisible to every report in the system.
 */
export interface MemberAdmission {
  member: CreateInput<Member>
  membership: Omit<CreateInput<Membership>, 'memberId'>
}

export interface MemberRepository extends CrudRepository<Member> {
  admit(admission: MemberAdmission): Promise<Member>
}

export type ClientRepository = CrudRepository<Client>

export interface MembershipFilter {
  cycleId?: ID
  memberId?: ID
}

export interface MembershipRepository extends CrudRepository<Membership> {
  listBy(filter: MembershipFilter): Promise<Membership[]>
}

export interface DealFilter {
  cycleId?: ID
  stage?: DealStage
}

export interface DealRepository extends CrudRepository<Deal> {
  listBy(filter: DealFilter): Promise<Deal[]>
  /**
   * Moves a deal across the funnel. Closing as lost carries the reason, which
   * the API stamps together with the close date — never two round trips.
   */
  changeStage(id: ID, stage: DealStage, lossReason?: Deal['lossReason']): Promise<Deal>
}

export interface ProjectFilter {
  cycleId?: ID
  status?: ProjectStatus
}

export interface ProjectRepository extends CrudRepository<Project> {
  /**
   * Projects of one management.
   *
   * Every record in this system belongs to a cycle, and until this existed each
   * caller filtered `project.cycleId === …` by hand — nine copies of the same
   * line, and a silent empty list whenever the cycle had not loaded yet.
   */
  listBy(filter: ProjectFilter): Promise<Project[]>
  /** Moves a project across board columns without sending the whole record. */
  changeStatus(id: ID, status: ProjectStatus): Promise<Project>
}

export interface AllocationFilter {
  memberId?: ID
  projectId?: ID
  /** Only allocations covering this date. Defaults to every allocation. */
  activeOn?: IsoDate
}

export interface AllocationRepository extends CrudRepository<Allocation> {
  listBy(filter: AllocationFilter): Promise<Allocation[]>
}

export interface TimeEntryFilter {
  memberId?: ID
  projectId?: ID
  from?: IsoDate
  to?: IsoDate
}

export interface TimeEntryRepository extends CrudRepository<TimeEntry> {
  listBy(filter: TimeEntryFilter): Promise<TimeEntry[]>
}

export interface FinanceFilter {
  cycleId?: ID
  kind?: FinanceEntry['kind']
  /** `open` is anything unpaid, `overdue` the unpaid lines past their due date. */
  settlement?: 'open' | 'settled' | 'overdue'
}

export interface FinanceRepository extends CrudRepository<FinanceEntry> {
  listBy(filter: FinanceFilter): Promise<FinanceEntry[]>
  /** Marks a line as paid or received on a date. */
  settle(id: ID, paidAt: IsoDate | null): Promise<FinanceEntry>
}

export interface CalendarEventFilter {
  cycleId?: ID
  directorate?: Directorate
  kind?: EventKind
  /**
   * Commitments touching this range, not only those opening inside it — a
   * selection week that starts in August is still on September's calendar.
   */
  from?: IsoDate
  to?: IsoDate
}

export interface CalendarEventRepository extends CrudRepository<CalendarEvent> {
  listBy(filter: CalendarEventFilter): Promise<CalendarEvent[]>
  /**
   * Calls a commitment off, or puts it back on.
   *
   * Not a delete: whoever had blocked the evening has to see that the meeting
   * is cancelled. A record that simply vanishes reads as a glitch, and the
   * person turns up anyway.
   */
  cancel(id: ID, cancelled: boolean): Promise<CalendarEvent>
}

/** Every report is read for one term, optionally narrowed to a date range. */
export interface ReportScope {
  cycleId?: ID
  from?: IsoDate
  to?: IsoDate
}

export interface ReportService {
  dashboardMetrics(scope?: ReportScope): Promise<DashboardMetrics>
  cycleProgress(cycleId: ID): Promise<CycleProgress | null>
  workloadByMember(scope?: ReportScope): Promise<MemberWorkload[]>
  /**
   * Takes a cycle rather than a `ReportScope`: a project's margin is its whole
   * life, not a slice of it. Accepting `from`/`to` here and ignoring them made
   * the reports screen offer a date filter that silently did nothing.
   */
  projectMargins(cycleId?: ID): Promise<ProjectMargin[]>
  hoursByCategory(scope?: ReportScope): Promise<HoursByCategory[]>
  funnel(scope?: ReportScope): Promise<FunnelSummary>
  cashFlow(scope?: ReportScope): Promise<CashFlowSummary>
}

/**
 * The signed-in enterprise.
 *
 * Read-only and without an id argument on purpose: there is exactly one
 * enterprise a session can see, and it is the one in the caller's token. An
 * endpoint that took an id would be an invitation to pass somebody else's.
 */
export interface EnterpriseGateway {
  current(): Promise<JuniorEnterprise | null>
}

export type CourseRepository = CrudRepository<Course>
export type WorkAreaRepository = CrudRepository<WorkArea>

export interface DataLayer {
  enterprise: EnterpriseGateway
  courses: CourseRepository
  workAreas: WorkAreaRepository
  cycles: CycleRepository
  members: MemberRepository
  memberships: MembershipRepository
  clients: ClientRepository
  deals: DealRepository
  projects: ProjectRepository
  allocations: AllocationRepository
  timeEntries: TimeEntryRepository
  finance: FinanceRepository
  calendarEvents: CalendarEventRepository
  reports: ReportService
}
