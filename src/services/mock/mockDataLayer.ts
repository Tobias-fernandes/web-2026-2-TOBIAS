import type { DataLayer } from '@/services/types'
import { activeEnterpriseId } from './tenantStorage'
import { findEnterprise } from './enterprises'
import { mockReports } from './reports'
import {
  allocations,
  calendarEvents,
  clients,
  courses,
  cycles,
  deals,
  finance,
  members,
  memberships,
  projects,
  timeEntries,
  workAreas,
} from './repositories'

export const mockDataLayer: DataLayer = {
  enterprise: {
    // Resolved from the stored session, the way the API resolves it from the
    // token: whoever is signed in gets their own enterprise and no other.
    async current() {
      return findEnterprise(activeEnterpriseId())
    },
  },
  courses,
  workAreas,
  cycles,
  members,
  memberships,
  clients,
  deals,
  projects,
  allocations,
  timeEntries,
  finance,
  calendarEvents,
  reports: mockReports,
}
