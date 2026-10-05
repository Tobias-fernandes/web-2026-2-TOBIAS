import { ROUTES } from "@/config/routes";
import type { StartingChecklistEntry } from "./types";

/** How many members the dashboard's workload chart lists before it gets noisy. */
export const WORKLOAD_CHART_LIMIT = 6;

/** A due date at or under this many days is highlighted as urgent. */
export const URGENT_DUE_DAYS = 7;

/** Remembers, per management, that the board dismissed the starting checklist. */
export const STARTING_CHECKLIST_DISMISSED_KEY = (cycleId: string) =>
  `altotech:starting-checklist-dismissed:${cycleId}`;

/**
 * What an EJ that joined mid-term brings over, in the order it depends on
 * itself: projects need clients, allocations need members.
 */
export const STARTING_CHECKLIST_ITEMS: StartingChecklistEntry[] = [
  {
    label: "Clientes",
    text: "Com quem a EJ já trabalha ou está negociando.",
    to: ROUTES.app.clients,
    isDone: (counts) => counts.clients > 0,
  },
  {
    label: "Projetos em execução",
    text: "Os entregues já contaram no cadastro; aqui entram os que estão rodando.",
    to: ROUTES.app.projects,
    isDone: (counts) => counts.projects > 0,
  },
  {
    label: "Membros",
    text: "Quem faz parte da gestão, com cargo e área.",
    to: ROUTES.app.members,
    // The president is already in, registered at sign-up.
    isDone: (counts) => counts.memberships > 1,
  },
  {
    label: "Funil de vendas",
    text: "As negociações que ainda não fecharam.",
    to: ROUTES.app.funnel,
    isDone: (counts) => counts.deals > 0,
  },
  {
    label: "Parcelas em aberto",
    text: "O que ainda falta receber ou pagar. O que já caiu está no saldo.",
    to: ROUTES.app.finance,
    isDone: (counts) => counts.ledgerLines > 0,
  },
];
