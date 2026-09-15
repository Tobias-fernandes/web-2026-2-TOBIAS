import { api } from '@/lib/http'
import type {
  Client,
  CreateInput,
  DashboardMetrics,
  ID,
  Member,
  MemberHours,
  Project,
  ProjectHours,
  TimeEntry,
} from '@/domain/types'
import type {
  CrudRepository,
  DataLayer,
  ReportPeriod,
  TimeEntryFilter,
} from '@/services/types'

/**
 * Data contracts implemented against the AWS API.
 *
 * Used when VITE_DATA_SOURCE=aws and VITE_API_URL points at the published
 * endpoint (API Gateway + Lambda, or whichever service is chosen). The bearer
 * token is attached by the client in `src/lib/http`.
 *
 * Expected endpoints (all under VITE_API_URL):
 *   GET    /clients                      → Client[]
 *   GET    /clients/:id                  → Client
 *   POST   /clients                      → Client
 *   PUT    /clients/:id                  → Client
 *   DELETE /clients/:id                  → 204
 *   …same for /members, /projects and /time-entries
 *   PATCH  /projects/:id/status          → Project
 *   GET    /time-entries?memberId=&projectId=&from=&to=  → TimeEntry[]
 *   GET    /reports/dashboard?from=&to=          → DashboardMetrics
 *   GET    /reports/hours-by-member?from=&to=    → MemberHours[]
 *   GET    /reports/hours-by-project?from=&to=   → ProjectHours[]
 */
function crudResource<T extends { id: ID }>(path: string): CrudRepository<T> {
  return {
    list: () => api.get<T[]>(path),
    get: (id) => api.get<T | null>(`${path}/${id}`),
    create: (input: CreateInput<T>) => api.post<T>(path, input),
    update: (id, input) => api.put<T>(`${path}/${id}`, input),
    remove: (id) => api.delete<void>(`${path}/${id}`),
  }
}

export const apiDataLayer: DataLayer = {
  clients: crudResource<Client>('/clients'),
  members: crudResource<Member>('/members'),

  projects: {
    ...crudResource<Project>('/projects'),
    changeStatus: (id, status) =>
      api.patch<Project>(`/projects/${id}/status`, { status }),
  },

  timeEntries: {
    ...crudResource<TimeEntry>('/time-entries'),
    listBy: (filter: TimeEntryFilter) =>
      api.get<TimeEntry[]>('/time-entries', { ...filter }),
  },

  reports: {
    dashboardMetrics: (period: ReportPeriod = {}) =>
      api.get<DashboardMetrics>('/reports/dashboard', { ...period }),
    hoursByMember: (period: ReportPeriod = {}) =>
      api.get<MemberHours[]>('/reports/hours-by-member', { ...period }),
    hoursByProject: (period: ReportPeriod = {}) =>
      api.get<ProjectHours[]>('/reports/hours-by-project', { ...period }),
  },
}
