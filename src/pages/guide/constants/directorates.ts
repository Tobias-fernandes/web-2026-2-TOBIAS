import { ROUTES } from "@/config/routes";
import type { DirectorateGuide } from "../types";

export const DIRECTORATE_GUIDES: DirectorateGuide[] = [
  {
    directorate: "presidency",
    does: "Acompanha as metas do ano contra o ritmo real, vê o consolidado de todas as áreas, convoca as reuniões gerais e fecha o relatório da gestão.",
    screens: [
      { label: "Painel", to: ROUTES.app.root },
      { label: "Gestão e metas", to: ROUTES.app.cycle },
      { label: "Calendário", to: ROUTES.app.calendar },
      { label: "Relatórios", to: ROUTES.app.reports },
    ],
  },
  {
    directorate: "commercial",
    does: "Mantém o funil vivo: qualifica leads, envia propostas, registra ganhos e perdas com motivo, e cuida do cadastro de clientes.",
    screens: [
      { label: "Funil", to: ROUTES.app.funnel },
      { label: "Clientes", to: ROUTES.app.clients },
    ],
  },
  {
    directorate: "marketing",
    does: "Registra a origem de cada oportunidade e usa a conversão por origem para decidir onde vale investir esforço e verba.",
    screens: [
      { label: "Funil", to: ROUTES.app.funnel },
      { label: "Clientes", to: ROUTES.app.clients },
    ],
  },
  {
    directorate: "projects",
    does: "Abre e move os projetos, aloca a equipe e acompanha o consumo do orçamento de horas contra o que foi lançado.",
    screens: [
      { label: "Projetos", to: ROUTES.app.projects },
      { label: "Alocação", to: ROUTES.app.allocation },
      { label: "Minhas horas", to: ROUTES.app.timeEntries },
    ],
  },
  {
    directorate: "finance",
    does: "Lança parcelas a receber e custos a pagar, dá baixa no que entra e sai, e responde qual é o saldo real da gestão.",
    screens: [
      { label: "Contas e fluxo", to: ROUTES.app.finance },
      { label: "Relatórios", to: ROUTES.app.reports },
    ],
  },
  {
    directorate: "people",
    does: "Cadastra quem entra, define cargo e carga de cada pessoa na gestão, marca capacitações e processo seletivo, e usa a capacidade para agir antes de alguém pedir para sair.",
    screens: [
      { label: "Membros", to: ROUTES.app.members },
      { label: "Calendário", to: ROUTES.app.calendar },
      { label: "Alocação", to: ROUTES.app.allocation },
    ],
  },
];

/** The habit that keeps the data honest. Everything else depends on it. */
