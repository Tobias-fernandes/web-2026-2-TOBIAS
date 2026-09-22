import type { RoadmapPhase, RoadmapStatus } from '../types'

export const ROADMAP_STATUS_LABELS: Record<RoadmapStatus, string> = {
  done: 'Disponível',
  building: 'Em construção',
  planned: 'Planejado',
}

/**
 * What the system already does and where it is going.
 *
 * Published inside the app on purpose: a member who knows what is coming stops
 * building the parallel spreadsheet that kills adoption.
 */
export const ROADMAP: RoadmapPhase[] = [
  {
    status: 'done',
    title: 'Fase 1 — O núcleo que sustenta tudo',
    summary:
      'A espinha dorsal: gestão anual, pessoas com cargo por ciclo, projetos e o lançamento de horas por tipo.',
    items: [
      'Gestão (ciclo) com metas de faturamento, projetos, membros e satisfação',
      'Membros e posições por gestão — o cargo muda, a pessoa continua',
      'Projetos com escopo, gerente, prazo e orçamento de horas',
      'Grade semanal de horas com tipo — projeto, gestão interna, capacitação, comercial, evento',
      'Calendário da gestão: reuniões, capacitações, eventos e as entregas dos projetos no mesmo mês',
      'Permissões por cargo, diretoria e posse do próprio registro',
    ],
  },
  {
    status: 'done',
    title: 'Fase 2 — Os números que ninguém tinha',
    summary:
      'A camada que transforma cadastro em decisão: margem real, capacidade, funil e caixa.',
    items: [
      'Margem por projeto: hora orçada contra hora real',
      'Capacidade da equipe: alocado contra pactuado contra lançado',
      'Funil comercial com origem, conversão e motivo de perda',
      'Fluxo de caixa por parcelas, com vencidos e saldo da gestão',
      'Painel de metas com o ritmo do ano como referência',
    ],
  },
  {
    status: 'building',
    title: 'Fase 3 — A gestão de pessoas completa',
    summary:
      'O que segura a EJ no médio prazo: entrada, desenvolvimento e permanência dos membros.',
    items: [
      'Processo seletivo com etapas, candidatos e aproveitamento',
      'Capacitações com presença e trilha de desenvolvimento',
      'Avaliação de desempenho e feedback por gestão',
      'Pesquisa de clima e acompanhamento de desligamentos',
    ],
  },
  {
    status: 'planned',
    title: 'Fase 4 — Profundidade por diretoria',
    summary:
      'Os detalhes que cada área pede depois que o básico já roda todo dia.',
    items: [
      'Compromissos que se repetem, convites por e-mail e confirmação de presença',
      'Calendário editorial de marketing ligado às origens que mais convertem no funil',
      'Geração de proposta e contrato em PDF a partir da negociação',
      'Pesquisa de satisfação enviada ao cliente na entrega',
      'Orçamento por diretoria e fechamento contábil da gestão',
      'Relatório de fim de gestão exportável e integrações com a federação',
    ],
  },
]
