import { ROUTES } from '@/config/routes'
import type { FlowStep } from '../types'

/**
 * The value chain of a junior enterprise, which is what the system models.
 *
 * Written out for the reader because the screens only make sense as one chain:
 * a lead becomes a contract, a contract becomes hours, hours become the margin
 * that changes the next proposal.
 */
export const FLOW_STEPS: FlowStep[] = [
  {
    title: '1. Chega uma oportunidade',
    text: 'Marketing e comercial registram o contato como lead e abrem a negociação no funil, com origem e valor estimado.',
    route: ROUTES.app.funnel,
    routeLabel: 'Funil',
  },
  {
    title: '2. A negociação avança ou cai',
    text: 'A oportunidade caminha pelas etapas até ser ganha ou perdida. Perder é registrado com o motivo — é o que ensina a próxima gestão.',
    route: ROUTES.app.funnel,
    routeLabel: 'Funil',
  },
  {
    title: '3. O contrato vira projeto',
    text: 'Ganhou, abre-se o projeto: escopo, gerente, prazo e, principalmente, as horas orçadas — a base do preço.',
    route: ROUTES.app.projects,
    routeLabel: 'Projetos',
  },
  {
    title: '4. A equipe é alocada',
    text: 'Cada membro recebe uma carga semanal no projeto. A soma das alocações mostra quem está sobrecarregado antes de a gestão acabar.',
    route: ROUTES.app.allocation,
    routeLabel: 'Alocação',
  },
  {
    title: '5. As horas são lançadas',
    text: 'O membro preenche a semana na grade. Não há fila de aprovação: a folha é um guia para a EJ se enxergar, não um ponto a ser fiscalizado.',
    route: ROUTES.app.timeEntries,
    routeLabel: 'Minhas horas',
  },
  {
    title: '6. O dinheiro entra em parcelas',
    text: 'As parcelas do contrato viram lançamentos com data. Contrato assinado não é caixa, e o financeiro mostra a diferença.',
    route: ROUTES.app.finance,
    routeLabel: 'Financeiro',
  },
  {
    title: '7. Os números voltam para a diretoria',
    text: 'Faturamento, margem real por hora, satisfação do cliente e carga da equipe alimentam as metas da gestão e o relatório final.',
    route: ROUTES.app.root,
    routeLabel: 'Painel',
  },
]
