import type { Project, ProjectMargin } from '@/domain/types'
import { addDays, todayIso } from '@/lib/date'
import { activeCycle } from './cycles'

export const inProgressProject: Project = {
  id: 'prj-1',
  name: 'Site institucional',
  clientId: 'cli-1',
  cycleId: activeCycle.id,
  ownerId: 'mem-1',
  teamIds: ['mem-1', 'mem-4'],
  scope:
    'Site institucional de cinco páginas com catálogo de produtos e formulário de encomenda.',
  status: 'inProgress',
  stage: 'Revisão de conteúdo',
  contractValueCents: 480_000,
  estimatedHours: 120,
  startedAt: '2026-08-10',
  // Relative to today so the "due in N days" badge stays meaningful over time.
  dueAt: addDays(todayIso(), 6),
  closedAt: null,
  npsScore: null,
  dealId: null,
  createdAt: '2026-08-10',
}

export const overdueProject: Project = {
  ...inProgressProject,
  id: 'prj-2',
  name: 'App de vistoria',
  stage: 'Sprint 6 de 8',
  contractValueCents: 1_150_000,
  dueAt: addDays(todayIso(), -4),
}

export const planningProject: Project = {
  id: 'prj-3',
  name: 'Diagnóstico de processos',
  clientId: 'cli-3',
  cycleId: activeCycle.id,
  ownerId: 'mem-4',
  teamIds: ['mem-4'],
  scope: 'Mapeamento do fluxo de atendimento e proposta de redesenho.',
  status: 'planning',
  stage: 'Kickoff agendado',
  contractValueCents: 320_000,
  estimatedHours: 70,
  startedAt: '2026-09-22',
  dueAt: '2026-10-30',
  closedAt: null,
  npsScore: null,
  dealId: null,
  createdAt: '2026-09-05',
}

export const deliveredProject: Project = {
  id: 'prj-5',
  name: 'Catálogo digital',
  clientId: 'cli-1',
  cycleId: activeCycle.id,
  ownerId: 'mem-4',
  teamIds: ['mem-4'],
  scope: 'Catálogo de produtos com busca e link direto para pedido.',
  status: 'delivered',
  stage: 'Contrato encerrado',
  contractValueCents: 150_000,
  estimatedHours: 38,
  startedAt: '2026-08-05',
  dueAt: '2026-09-05',
  closedAt: '2026-09-04',
  npsScore: 10,
  dealId: null,
  createdAt: '2026-08-05',
}

export const projectList: Project[] = [
  planningProject,
  inProgressProject,
  overdueProject,
  deliveredProject,
]

/** Inside the budget: the card shows the violet bar and a healthy hourly rate. */
export const healthyMargin: ProjectMargin = {
  projectId: inProgressProject.id,
  name: inProgressProject.name,
  clientName: 'Padaria Pão de Ouro',
  contractValueCents: inProgressProject.contractValueCents,
  estimatedHours: 120,
  loggedHours: 64,
  hoursUsage: 64 / 120,
  estimatedHourlyRateCents: 4_000,
  realizedHourlyRateCents: 7_500,
}

/** Over the budget: the case the board needs to see before the next proposal. */
export const burningMargin: ProjectMargin = {
  projectId: overdueProject.id,
  name: overdueProject.name,
  clientName: 'Vistoria Norte Engenharia',
  contractValueCents: overdueProject.contractValueCents,
  estimatedHours: 260,
  loggedHours: 318,
  hoursUsage: 318 / 260,
  estimatedHourlyRateCents: 4_423,
  realizedHourlyRateCents: 3_616,
}
