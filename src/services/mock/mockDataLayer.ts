import { WEEKS_PER_TERM } from '@/domain/constants'
import type {
  Client,
  DashboardMetrics,
  Member,
  MemberHours,
  Project,
  ProjectHours,
  ProjectStatus,
  TimeEntry,
} from '@/domain/types'
import type {
  DataLayer,
  ProjectRepository,
  ReportPeriod,
  ReportService,
  TimeEntryFilter,
  TimeEntryRepository,
} from '@/services/types'
import {
  SEED_CLIENTS,
  SEED_MEMBERS,
  SEED_PROJECTS,
  SEED_TIME_ENTRIES,
} from './constants'
import { createMockRepository } from './createMockRepository'

const clients = createMockRepository<Client>('clients', SEED_CLIENTS, 'cli')
const members = createMockRepository<Member>('members', SEED_MEMBERS, 'mem')
const baseProjects = createMockRepository<Project>('projects', SEED_PROJECTS, 'prj')
const baseTimeEntries = createMockRepository<TimeEntry>(
  'timeEntries',
  SEED_TIME_ENTRIES,
  'tim',
)

const projects: ProjectRepository = {
  ...baseProjects,
  async changeStatus(id, status) {
    const isClosing = status === 'delivered' || status === 'cancelled'
    return baseProjects.update(id, {
      status,
      closedAt: isClosing ? new Date().toISOString().slice(0, 10) : null,
    })
  },
}

function isWithinPeriod(date: string, from?: string, to?: string): boolean {
  if (from && date < from) return false
  if (to && date > to) return false
  return true
}

const timeEntries: TimeEntryRepository = {
  ...baseTimeEntries,
  async listBy({ memberId, projectId, from, to }: TimeEntryFilter) {
    const all = await baseTimeEntries.list()
    return all.filter(
      (entry) =>
        (!memberId || entry.memberId === memberId) &&
        (!projectId || entry.projectId === projectId) &&
        isWithinPeriod(entry.date, from, to),
    )
  },
}

const reports: ReportService = {
  async dashboardMetrics(period: ReportPeriod = {}): Promise<DashboardMetrics> {
    const [allProjects, allMembers, allClients, entries] = await Promise.all([
      baseProjects.list(),
      members.list(),
      clients.list(),
      timeEntries.listBy(period),
    ])

    const withStatus = (status: ProjectStatus) =>
      allProjects.filter((project) => project.status === status)

    const delivered = withStatus('delivered')
    const inProgress = withStatus('inProgress')

    return {
      projectsInProgress: inProgress.length,
      projectsDelivered: delivered.length,
      projectsProspecting: withStatus('prospecting').length,
      activeMembers: allMembers.filter((member) => member.status === 'active').length,
      activeClients: allClients.filter((client) => client.status === 'active').length,
      loggedHours: entries.reduce((total, entry) => total + entry.hours, 0),
      contractedRevenue: [...inProgress, ...delivered].reduce(
        (total, project) => total + project.contractValue,
        0,
      ),
      realizedRevenue: delivered.reduce(
        (total, project) => total + project.contractValue,
        0,
      ),
    }
  },

  async hoursByMember(period: ReportPeriod = {}): Promise<MemberHours[]> {
    const [allMembers, entries] = await Promise.all([
      members.list(),
      timeEntries.listBy(period),
    ])

    return allMembers
      .filter((member) => member.status !== 'inactive')
      .map((member) => {
        const hours = entries
          .filter((entry) => entry.memberId === member.id)
          .reduce((total, entry) => total + entry.hours, 0)

        const expected = member.weeklyHours * WEEKS_PER_TERM

        return {
          memberId: member.id,
          name: member.name,
          role: member.role,
          hours,
          utilization: expected > 0 ? hours / expected : 0,
        }
      })
      .sort((a, b) => b.hours - a.hours)
  },

  async hoursByProject(period: ReportPeriod = {}): Promise<ProjectHours[]> {
    const [allProjects, entries] = await Promise.all([
      baseProjects.list(),
      timeEntries.listBy(period),
    ])

    return allProjects
      .map((project) => ({
        projectId: project.id,
        name: project.name,
        estimatedHours: project.estimatedHours,
        hours: entries
          .filter((entry) => entry.projectId === project.id)
          .reduce((total, entry) => total + entry.hours, 0),
      }))
      .sort((a, b) => b.hours - a.hours)
  },
}

export const mockDataLayer: DataLayer = {
  clients,
  members,
  projects,
  timeEntries,
  reports,
}
