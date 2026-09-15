import type {
  ClientStatus,
  MemberRole,
  MemberStatus,
  ProjectStatus,
} from '@/domain/types'

/**
 * Display labels. These are the only strings in the domain layer that stay in
 * Portuguese — they are rendered to the user.
 */

/** Shared visual tone for badges and status pickers, following the brand palette. */
export type Tone = 'neutral' | 'violet' | 'green' | 'amber'

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  president: 'Presidência',
  director: 'Diretoria',
  manager: 'Gerente de projeto',
  consultant: 'Consultor',
  trainee: 'Trainee',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  prospecting: 'Prospecção',
  inProgress: 'Em execução',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
}

export const PROJECT_STATUS_TONES: Record<ProjectStatus, Tone> = {
  prospecting: 'violet',
  inProgress: 'amber',
  delivered: 'green',
  cancelled: 'neutral',
}

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: 'Lead',
  negotiating: 'Em negociação',
  active: 'Ativo',
  closed: 'Encerrado',
}

export const CLIENT_STATUS_TONES: Record<ClientStatus, Tone> = {
  lead: 'neutral',
  negotiating: 'amber',
  active: 'green',
  closed: 'neutral',
}

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  active: 'Ativo',
  onLeave: 'Afastado',
  inactive: 'Desligado',
}

export const MEMBER_STATUS_TONES: Record<MemberStatus, Tone> = {
  active: 'green',
  onLeave: 'amber',
  inactive: 'neutral',
}

/** Column order on the project board. Cancelled projects are not shown there. */
export const PROJECT_BOARD_COLUMNS: ProjectStatus[] = [
  'prospecting',
  'inProgress',
  'delivered',
]

/** Weeks considered when measuring a member's utilization against their load. */
export const WEEKS_PER_TERM = 16
