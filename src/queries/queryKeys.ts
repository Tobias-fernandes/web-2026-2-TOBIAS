import type {
  AllocationFilter,
  CalendarEventFilter,
  DealFilter,
  FinanceFilter,
  MembershipFilter,
  ProjectFilter,
  ReportScope,
  TimeEntryFilter,
} from "@/services";

/**
 * Query key factory.
 *
 * Every key is built here so the key space stays visible in one file, and so the
 * entity hooks can be handed their group whole (`createEntityQueries`).
 */
const entity = (name: string) => ({
  all: [name] as const,
  detail: (id: string) => [name, id] as const,
});

export const queryKeys = {
  enterprise: entity("enterprise"),
  courses: entity("courses"),
  workAreas: entity("work-areas"),
  cycles: entity("cycles"),
  members: entity("members"),
  clients: entity("clients"),

  projects: {
    ...entity("projects"),
    filtered: (filter: ProjectFilter) => ["projects", filter] as const,
  },
  deals: {
    ...entity("deals"),
    filtered: (filter: DealFilter) => ["deals", filter] as const,
  },
  memberships: {
    ...entity("memberships"),
    filtered: (filter: MembershipFilter) => ["memberships", filter] as const,
  },
  allocations: {
    ...entity("allocations"),
    filtered: (filter: AllocationFilter) => ["allocations", filter] as const,
  },
  timeEntries: {
    ...entity("timeEntries"),
    filtered: (filter: TimeEntryFilter) => ["timeEntries", filter] as const,
  },
  finance: {
    ...entity("finance"),
    filtered: (filter: FinanceFilter) => ["finance", filter] as const,
  },
  calendarEvents: {
    ...entity("calendarEvents"),
    filtered: (filter: CalendarEventFilter) =>
      ["calendarEvents", filter] as const,
  },

  reports: {
    dashboard: (scope: ReportScope) => ["reports", "dashboard", scope] as const,
    cycleProgress: (cycleId: string) =>
      ["reports", "cycleProgress", cycleId] as const,
    workload: (scope: ReportScope) => ["reports", "workload", scope] as const,
    projectMargins: (cycleId: string) =>
      ["reports", "projectMargins", cycleId] as const,
    hoursByCategory: (scope: ReportScope) =>
      ["reports", "hoursByCategory", scope] as const,
    funnel: (scope: ReportScope) => ["reports", "funnel", scope] as const,
    cashFlow: (scope: ReportScope) => ["reports", "cashFlow", scope] as const,
  },
} as const;
