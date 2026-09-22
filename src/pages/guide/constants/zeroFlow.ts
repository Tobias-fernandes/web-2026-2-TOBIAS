import { ROUTES } from "@/config/routes";
import type { ZeroStep } from "../types";

/**
 * The order an empty system has to be filled in.
 *
 * Not a preference: each step needs what the one before it created. There is
 * nowhere to put a project before a gestão exists, nobody to allocate before
 * the members are registered, and no hours to approve before someone logs them.
 * Walking it once is the fastest way to understand why the screens are wired
 * the way they are.
 */
export const ZERO_FLOW: ZeroStep[] = [
  {
    route: ROUTES.app.cycle,
    routeLabel: "Gestão e metas",
    what: "Abra a gestão do ano: o dia em que a diretoria assumiu e as metas. Não se pede nome nem data de fim — a gestão é chamada pelo ano de início, e o fim é carimbado quando ela for encerrada. Nada mais no sistema tem onde existir antes disso.",
  },
  {
    route: ROUTES.app.members,
    routeLabel: "Membros",
    what: "Cadastre as pessoas e o cargo de cada uma nesta gestão, começando por você. Cargo e carga semanal são da gestão, não da pessoa.",
  },
  {
    route: ROUTES.app.clients,
    routeLabel: "Clientes",
    what: "Cadastre o primeiro contato. O cadastro de clientes é o que continua na EJ quando a diretoria muda.",
  },
  {
    route: ROUTES.app.funnel,
    routeLabel: "Funil",
    what: "Abra a negociação com origem e valor estimado, mova pelas etapas e feche como ganha. Perder também é registrado, com o motivo.",
  },
  {
    route: ROUTES.app.projects,
    routeLabel: "Projetos",
    what: "Ganhou, vira projeto: escopo, gerente, prazo e as horas orçadas — é a hora orçada que a margem vai comparar com a real.",
  },
  {
    route: ROUTES.app.allocation,
    routeLabel: "Alocação",
    what: "Dê a cada membro uma carga semanal no projeto. A soma das alocações é o que revela sobrecarga antes de a gestão acabar.",
  },
  {
    route: ROUTES.app.timeEntries,
    routeLabel: "Minhas horas",
    what: "Clique no dia da grade e lance as horas. Repare que capacitação e reunião interna também são horas da EJ — e que a hora entra no relatório na hora, sem passar por aprovação.",
  },
  {
    route: ROUTES.app.finance,
    routeLabel: "Contas e fluxo",
    what: "Lance a parcela a receber do contrato e dê baixa quando o dinheiro entrar. Contrato assinado não é caixa, e a diferença aparece aqui.",
  },
  {
    route: ROUTES.app.calendar,
    routeLabel: "Calendário",
    what: "Marque a reunião de diretoria e a capacitação. A entrega do projeto já aparece sozinha, tracejada, vinda do prazo que você deu a ele.",
  },
  {
    route: ROUTES.app.root,
    routeLabel: "Painel",
    what: "Agora os números existem: metas contra o ritmo do ano, margem real por hora, caixa e carga da equipe. Nenhum deles foi digitado — todos vieram dos passos acima.",
  },
];
