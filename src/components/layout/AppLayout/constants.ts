import { ROUTES } from "@/config/routes";
import type { NavGroup } from "./types";

/**
 * The menu, grouped the way a junior enterprise is organised.
 *
 * Grouping by directorate rather than listing twelve links flat: a member of the
 * commercial team should find their two screens without reading the finance
 * ones, and the board should see that every area has a place in the system.
 */
const APP_NAV_GROUPS: NavGroup[] = [
  {
    label: "Gestão",
    items: [
      { to: ROUTES.app.root, label: "Painel", end: true },
      { to: ROUTES.app.cycle, label: "Gestão e metas" },
      { to: ROUTES.app.calendar, label: "Calendário" },
    ],
  },
  {
    label: "Projetos",
    items: [
      { to: ROUTES.app.projects, label: "Projetos" },
      { to: ROUTES.app.allocation, label: "Alocação" },
      { to: ROUTES.app.timeEntries, label: "Minhas horas" },
    ],
  },
  {
    label: "Comercial",
    items: [
      { to: ROUTES.app.funnel, label: "Funil" },
      { to: ROUTES.app.clients, label: "Clientes" },
    ],
  },
  {
    label: "Financeiro",
    items: [
      {
        to: ROUTES.app.finance,
        label: "Contas e fluxo",
        permission: "finance:view",
      },
    ],
  },
  {
    label: "Pessoas",
    items: [{ to: ROUTES.app.members, label: "Membros" }],
  },
  {
    label: "Apoio",
    items: [
      { to: ROUTES.app.reports, label: "Relatórios" },
      { to: ROUTES.app.guide, label: "Como funciona" },
    ],
  },
];

export { APP_NAV_GROUPS };
