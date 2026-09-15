import type { Project } from '@/domain/types'

export const inProgressProject: Project = {
  id: 'prj-1',
  name: 'Site institucional',
  clientId: 'cli-1',
  ownerId: 'mem-1',
  teamIds: ['mem-1', 'mem-4'],
  scope:
    'Site institucional de cinco páginas com catálogo de produtos e formulário de encomenda.',
  status: 'inProgress',
  stage: 'Revisão de conteúdo',
  contractValue: 4800,
  estimatedHours: 120,
  startedAt: '2026-07-14',
  // Relative to today so the "due in N days" badge stays meaningful over time.
  dueAt: new Date(Date.now() + 6 * 86_400_000).toISOString().slice(0, 10),
  closedAt: null,
}

export const overdueProject: Project = {
  ...inProgressProject,
  id: 'prj-2',
  name: 'App de vistoria',
  stage: 'Sprint 3 de 5',
  contractValue: 11500,
  dueAt: new Date(Date.now() - 4 * 86_400_000).toISOString().slice(0, 10),
}

export const prospectingProject: Project = {
  id: 'prj-3',
  name: 'Diagnóstico de processos',
  clientId: 'cli-3',
  ownerId: 'mem-4',
  teamIds: ['mem-4'],
  scope: 'Mapeamento do fluxo de atendimento e proposta de redesenho.',
  status: 'prospecting',
  stage: 'Proposta enviada',
  contractValue: 3200,
  estimatedHours: 70,
  startedAt: '2026-09-02',
  dueAt: '2026-10-10',
  closedAt: null,
}

export const deliveredProject: Project = {
  id: 'prj-5',
  name: 'Landing page',
  clientId: 'cli-1',
  ownerId: 'mem-4',
  teamIds: ['mem-4'],
  scope: 'Página de captura para a campanha de fim de ano.',
  status: 'delivered',
  stage: 'Contrato encerrado',
  contractValue: 1900,
  estimatedHours: 45,
  startedAt: '2026-02-03',
  dueAt: '2026-04-12',
  closedAt: '2026-04-10',
}

export const projectList: Project[] = [
  prospectingProject,
  inProgressProject,
  overdueProject,
  deliveredProject,
]
