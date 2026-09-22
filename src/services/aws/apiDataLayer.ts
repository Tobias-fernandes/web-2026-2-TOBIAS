import { api } from "@/lib/http";
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
  FinanceEntry,
  FunnelSummary,
  HoursByCategory,
  ID,
  JuniorEnterprise,
  Member,
  Membership,
  MemberWorkload,
  Project,
  ProjectMargin,
  TimeEntry,
  WorkArea,
} from "@/domain/types";
import type {
  AllocationFilter,
  CalendarEventFilter,
  CrudRepository,
  DataLayer,
  DealFilter,
  FinanceFilter,
  MemberAdmission,
  MembershipFilter,
  ProjectFilter,
  ReportScope,
  TimeEntryFilter,
} from "@/services/types";

/**
 * Data contracts implemented against the AWS API.
 *
 * Used when VITE_DATA_SOURCE=aws and VITE_API_URL points at the published
 * endpoint (API Gateway + Lambda, or whichever service is chosen). The bearer
 * token is attached by the client in `src/lib/http`.
 *
 * Expected endpoints (all under VITE_API_URL):
 *   GET             /enterprise                  the signed-in EJ, from the token
 *   GET/POST        /courses, /work-areas, /cycles, /members, /memberships,
 *                   /clients, /deals, /projects, /allocations, /time-entries,
 *                   /finance, /calendar-events
 *   GET/PUT/DELETE  the same paths with /:id
 *   POST   /members/admissions           { member, membership }     → Member
 *   GET    /projects?cycleId=&status=
 *   GET    /deals?cycleId=&stage=
 *   PATCH  /deals/:id/stage               { stage, lossReason }      → Deal
 *   PATCH  /projects/:id/status           { status }                 → Project
 *   PATCH  /finance/:id/settlement        { paidAt }                 → FinanceEntry
 *   PATCH  /calendar-events/:id/cancellation { cancelled }           → CalendarEvent
 *   GET    /memberships?cycleId=&memberId=
 *   GET    /allocations?memberId=&projectId=&activeOn=
 *   GET    /time-entries?memberId=&projectId=&from=&to=
 *   GET    /finance?cycleId=&kind=&settlement=
 *   GET    /calendar-events?cycleId=&directorate=&kind=&from=&to=
 *   GET    /reports/dashboard?cycleId=&from=&to=       → DashboardMetrics
 *   GET    /reports/cycles/:id/progress                → CycleProgress
 *   GET    /reports/workload?cycleId=&from=&to=        → MemberWorkload[]
 *   GET    /reports/project-margins?cycleId=           → ProjectMargin[]
 *   GET    /reports/hours-by-category?cycleId=&from=&to= → HoursByCategory[]
 *   GET    /reports/funnel?cycleId=                    → FunnelSummary
 *   GET    /reports/cash-flow?cycleId=                 → CashFlowSummary
 *
 * The aggregates live on the server on purpose: a browser cannot sum a term of
 * timesheets without downloading it first, and the numbers have to agree with
 * whatever the end-of-term report prints.
 */
function crudResource<T extends { id: ID }>(path: string): CrudRepository<T> {
  return {
    list: () => api.get<T[]>(path),
    get: (id) => api.get<T | null>(`${path}/${id}`),
    create: (input: CreateInput<T>) => api.post<T>(path, input),
    update: (id, input) => api.put<T>(`${path}/${id}`, input),
    remove: (id) => api.delete<void>(`${path}/${id}`),
  };
}

export const apiDataLayer: DataLayer = {
  // No id in the path: the enterprise served is the one in the token.
  enterprise: {
    current: () => api.get<JuniorEnterprise | null>("/enterprise"),
  },
  courses: crudResource<Course>("/courses"),
  workAreas: crudResource<WorkArea>("/work-areas"),
  cycles: crudResource<Cycle>("/cycles"),
  clients: crudResource<Client>("/clients"),

  members: {
    ...crudResource<Member>("/members"),
    // One request, so a person is never created without the position that makes
    // them visible to the reports.
    admit: (admission: MemberAdmission) =>
      api.post<Member>("/members/admissions", admission),
  },

  memberships: {
    ...crudResource<Membership>("/memberships"),
    listBy: (filter: MembershipFilter) =>
      api.get<Membership[]>("/memberships", { ...filter }),
  },

  deals: {
    ...crudResource<Deal>("/deals"),
    listBy: (filter: DealFilter) => api.get<Deal[]>("/deals", { ...filter }),
    changeStage: (id, stage, lossReason) =>
      api.patch<Deal>(`/deals/${id}/stage`, {
        stage,
        lossReason: lossReason ?? null,
      }),
  },

  projects: {
    ...crudResource<Project>("/projects"),
    listBy: (filter: ProjectFilter) =>
      api.get<Project[]>("/projects", { ...filter }),
    changeStatus: (id, status) =>
      api.patch<Project>(`/projects/${id}/status`, { status }),
  },

  allocations: {
    ...crudResource<Allocation>("/allocations"),
    listBy: (filter: AllocationFilter) =>
      api.get<Allocation[]>("/allocations", { ...filter }),
  },

  timeEntries: {
    ...crudResource<TimeEntry>("/time-entries"),
    listBy: (filter: TimeEntryFilter) =>
      api.get<TimeEntry[]>("/time-entries", { ...filter }),
  },

  finance: {
    ...crudResource<FinanceEntry>("/finance"),
    listBy: (filter: FinanceFilter) =>
      api.get<FinanceEntry[]>("/finance", { ...filter }),
    settle: (id, paidAt) =>
      api.patch<FinanceEntry>(`/finance/${id}/settlement`, { paidAt }),
  },

  calendarEvents: {
    ...crudResource<CalendarEvent>("/calendar-events"),
    listBy: (filter: CalendarEventFilter) =>
      api.get<CalendarEvent[]>("/calendar-events", { ...filter }),
    cancel: (id, cancelled) =>
      api.patch<CalendarEvent>(`/calendar-events/${id}/cancellation`, {
        cancelled,
      }),
  },

  reports: {
    dashboardMetrics: (scope: ReportScope = {}) =>
      api.get<DashboardMetrics>("/reports/dashboard", { ...scope }),
    cycleProgress: (cycleId) =>
      api.get<CycleProgress | null>(`/reports/cycles/${cycleId}/progress`),
    workloadByMember: (scope: ReportScope = {}) =>
      api.get<MemberWorkload[]>("/reports/workload", { ...scope }),
    projectMargins: (cycleId?: ID) =>
      api.get<ProjectMargin[]>("/reports/project-margins", { cycleId }),
    hoursByCategory: (scope: ReportScope = {}) =>
      api.get<HoursByCategory[]>("/reports/hours-by-category", { ...scope }),
    funnel: (scope: ReportScope = {}) =>
      api.get<FunnelSummary>("/reports/funnel", { ...scope }),
    cashFlow: (scope: ReportScope = {}) =>
      api.get<CashFlowSummary>("/reports/cash-flow", { ...scope }),
  },
};
