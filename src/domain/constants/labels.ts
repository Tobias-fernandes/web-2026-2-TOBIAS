import type {
  ClientStatus,
  Cycle,
  CycleStatus,
  DealSource,
  DealStage,
  Directorate,
  EventAudience,
  EventKind,
  EventStatus,
  FinanceCategory,
  FinanceKind,
  LossReason,
  MemberRole,
  MemberStatus,
  ProjectStatus,
  TimeEntryCategory,
} from "@/domain/types";

/**
 * Display labels. These are the only strings in the domain layer that stay in
 * Portuguese — they are rendered to the user.
 */

export const CYCLE_STATUS_LABELS: Record<CycleStatus, string> = {
  planned: "Planejada",
  active: "Em andamento",
  closed: "Encerrada",
};

export const DIRECTORATE_LABELS: Record<Directorate, string> = {
  presidency: "Presidência",
  commercial: "Comercial",
  marketing: "Marketing",
  people: "Gestão de Pessoas",
  finance: "Financeiro",
  projects: "Gestão de Projetos",
};

export const MEMBER_ROLE_LABELS: Record<MemberRole, string> = {
  president: "Presidência",
  vicePresident: "Vice-presidência",
  director: "Diretoria",
  manager: "Gerente de projeto",
  consultant: "Consultor",
  trainee: "Trainee",
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  invited: "Convite pendente",
  active: "Ativo",
  onLeave: "Afastado",
  inactive: "Desligado",
};

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  lead: "Lead",
  negotiating: "Em negociação",
  active: "Ativo",
  closed: "Encerrado",
};

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  qualification: "Qualificação",
  diagnosis: "Diagnóstico",
  proposal: "Proposta enviada",
  negotiation: "Negociação",
  won: "Ganha",
  lost: "Perdida",
};

export const DEAL_SOURCE_LABELS: Record<DealSource, string> = {
  inbound: "Procurou a EJ",
  referral: "Indicação",
  event: "Evento",
  outbound: "Prospecção ativa",
  university: "Universidade",
  other: "Outra",
};

export const LOSS_REASON_LABELS: Record<LossReason, string> = {
  price: "Preço",
  timing: "Momento do cliente",
  scope: "Escopo fora do que fazemos",
  competitor: "Fechou com outro fornecedor",
  noResponse: "Parou de responder",
  other: "Outro motivo",
};

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  planning: "Planejamento",
  inProgress: "Em execução",
  review: "Em revisão",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export const TIME_ENTRY_CATEGORY_LABELS: Record<TimeEntryCategory, string> = {
  project: "Projeto",
  internal: "Gestão interna",
  training: "Capacitação",
  commercial: "Comercial",
  event: "Evento",
};

export const FINANCE_KIND_LABELS: Record<FinanceKind, string> = {
  receivable: "A receber",
  payable: "A pagar",
};

export const FINANCE_CATEGORY_LABELS: Record<FinanceCategory, string> = {
  projectInstalment: "Parcela de projeto",
  membershipFee: "Mensalidade de membro",
  sponsorship: "Patrocínio",
  award: "Premiação",
  federationFee: "Contribuição à federação",
  tooling: "Ferramentas e assinaturas",
  event: "Evento",
  training: "Capacitação",
  tax: "Tributos e taxas",
  reimbursement: "Reembolso a membro",
  other: "Outros",
};

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  meeting: "Reunião",
  training: "Capacitação",
  selection: "Processo seletivo",
  commercial: "Compromisso comercial",
  external: "Evento externo",
  social: "Integração",
  deadline: "Prazo",
};

export const EVENT_AUDIENCE_LABELS: Record<EventAudience, string> = {
  enterprise: "Toda a EJ",
  directorate: "Apenas a diretoria",
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  scheduled: "Confirmado",
  cancelled: "Cancelado",
};

/**
 * Who is expected at a commitment, in the words the calendar shows: "Toda a EJ"
 * or the name of the area that called it.
 */
export function describeAudience(
  audience: EventAudience,
  directorate: Directorate,
): string {
  return audience === "enterprise"
    ? EVENT_AUDIENCE_LABELS.enterprise
    : DIRECTORATE_LABELS[directorate];
}

/**
 * How a junior enterprise says which management it means: the year it opened.
 *
 * Derived instead of stored because nobody names a gestão — they say "a gestão
 * de 2026", and a field for that is a field that can disagree with the dates
 * next to it.
 */
export const describeCycle = (cycle: Pick<Cycle, "startsAt">): string =>
  cycle.startsAt.slice(0, 4);

/**
 * "Diretoria · Financeiro", but just "Presidência" when the position and the
 * area are the same word — which they are for the president and the vice, and
 * repeating it reads as a bug to whoever sees their own name under it.
 */
export function describePosition(
  role: MemberRole,
  directorate: Directorate,
): string {
  const position = MEMBER_ROLE_LABELS[role];
  const area = DIRECTORATE_LABELS[directorate];
  return position === area ? position : `${position} · ${area}`;
}
