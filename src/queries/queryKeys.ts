import type { ReportPeriod, TimeEntryFilter } from '@/services'

/**
 * Query key factory.
 *
 * Every key is built here so invalidation stays exact: invalidating
 * `queryKeys.projects.all` reaches every project query, including filtered ones.
 */
export const queryKeys = {
  clients: {
    all: ['clients'] as const,
    detail: (id: string) => ['clients', id] as const,
  },
  members: {
    all: ['members'] as const,
    detail: (id: string) => ['members', id] as const,
  },
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => ['projects', id] as const,
  },
  timeEntries: {
    all: ['timeEntries'] as const,
    filtered: (filter: TimeEntryFilter) => ['timeEntries', filter] as const,
  },
  reports: {
    all: ['reports'] as const,
    dashboard: (period: ReportPeriod) => ['reports', 'dashboard', period] as const,
    hoursByMember: (period: ReportPeriod) =>
      ['reports', 'hoursByMember', period] as const,
    hoursByProject: (period: ReportPeriod) =>
      ['reports', 'hoursByProject', period] as const,
  },
} as const
