import type {
  BoardPreviewColumn,
  ContentBlock,
  DirectoratePitch,
  FaqItem,
  MenuLink,
  PreviewMetric,
} from './types'

/**
 * Frequently asked questions.
 *
 * These must stay identical to the `FAQPage` JSON-LD block in `index.html` —
 * Google compares the rich result against what is visible on the page. Change
 * one, change the other.
 */
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'O que é o AltoTech Manager?',
    answer:
      'É um sistema web de gestão para empresas juniores. Ele reúne em um só lugar o funil comercial, os projetos, as horas dos membros, o financeiro e os indicadores que a EJ precisa para prestar contas no fim da gestão.',
  },
  {
    question: 'Quem pode usar o sistema?',
    answer:
      'Qualquer empresa júnior, federada ou em processo de federação, e também núcleos de extensão e ligas acadêmicas que trabalham por projetos com equipes que mudam todo ano.',
  },
  {
    question: 'O AltoTech Manager é gratuito?',
    answer:
      'Sim. O sistema é gratuito para empresas juniores: não há mensalidade, cobrança por membro nem limite de projetos, de clientes ou de horas lançadas.',
  },
  {
    question: 'Precisa instalar alguma coisa?',
    answer:
      'Não. É um sistema web: abre no navegador, no computador ou no celular, sem instalação, sem servidor próprio e sem planilha para manter em paralelo.',
  },
  {
    question: 'O que acontece na troca de diretoria?',
    answer:
      'Nada se perde. Cada ano é uma gestão, com diretoria e metas próprias, e o cargo de cada pessoa é registrado dentro dela. A diretoria que entra encontra o histórico completo de projetos, horas, clientes e contas — e consegue comparar o próprio ano com o da gestão anterior.',
  },
  {
    question: 'Como o sistema controla as horas dos membros?',
    answer:
      'O membro preenche a semana em uma grade, marcando se a hora foi de projeto, de gestão interna, de capacitação ou de prospecção. Não há fila de aprovação: a folha é um guia para a EJ se enxergar, não um ponto a ser fiscalizado — e toda hora lançada já entra no relatório, o que mantém a diretoria enxergando sobrecarga e ociosidade antes que virem problema.',
  },
  {
    question: 'Como acompanho o andamento dos projetos?',
    answer:
      'Pelo quadro de projetos, que mostra escopo, gerente, prazo e orçamento de horas de cada contrato, com o consumo em tempo real e o histórico do que já foi entregue.',
  },
]

/**
 * The questions the sales pitch is built on.
 *
 * Deliberately phrased as things a board already asks itself and cannot answer:
 * it is a sharper opening than a list of features, because the reader supplies
 * the pain from their own last management.
 */
export const KEY_QUESTIONS: string[] = [
  'Quantas horas custou, de verdade, o último projeto entregue?',
  'Quem está sobrecarregado nesta semana — e quem está há um mês sem projeto?',
  'Quanto já entrou no caixa, e quanto ainda está para receber?',
  'Por que a última proposta foi perdida?',
]

/** The four things a spreadsheet cannot do, which is what sells the system. */
export const HIGHLIGHTS: ContentBlock[] = [
  {
    title: 'A hora real de cada projeto',
    text: 'O valor do contrato dividido pelas horas que ele realmente consumiu, ao lado da hora que foi orçada. É o número que revela quando a EJ está vendendo barato demais — e o que corrige a próxima proposta.',
  },
  {
    title: 'Horas em uma grade, não de memória',
    text: 'A semana inteira em uma tela: o membro clica no dia, lança, e o número já está no relatório. Projeto, gestão interna, capacitação e prospecção contam separados.',
  },
  {
    title: 'Sobrecarga antes de virar desligamento',
    text: 'O planejado e o realizado lado a lado. Quem está alocado além da carga que pactuou aparece em âmbar, e quem está há semanas fora de qualquer projeto aparece antes de pedir para sair.',
  },
  {
    title: 'Metas medidas contra o ritmo do ano',
    text: 'Faturamento, projetos, membros e satisfação do cliente comparados ao quanto da gestão já passou. 60% da meta em março é ótimo; em outubro, é um alerta — e o painel diz qual dos dois é.',
  },
]

export const PAIN_POINTS: ContentBlock[] = [
  {
    title: 'Projetos que ninguém sabe onde param',
    text: 'Cada contrato tem escopo, gerente, prazo e orçamento de horas visíveis para a diretoria inteira, sem depender de quem foi à última reunião.',
  },
  {
    title: 'Horas lançadas de memória',
    text: 'A semana é preenchida em segundos, no próprio dia em que o trabalho aconteceu — não reconstituída de memória na sexta. E projeto não é o único tipo de hora que conta.',
  },
  {
    title: 'Ninguém sabe quanto vale a hora da EJ',
    text: 'O valor do contrato dividido pelas horas que ele realmente consumiu. É o número que mostra quando a EJ está vendendo barato demais.',
  },
  {
    title: 'Sobrecarga que só aparece quando alguém sai',
    text: 'O planejado e o realizado lado a lado: quem está alocado além da carga que pactuou e quem está há semanas sem entrar em projeto.',
  },
  {
    title: 'Prospecção espalhada no WhatsApp',
    text: 'Um funil com origem, valor e motivo de perda, que continua na EJ quando o diretor comercial sai.',
  },
  {
    title: 'Relatório da gestão feito na correria',
    text: 'Faturamento, projetos, satisfação do cliente e horas por membro já somados dentro da gestão, prontos para a prestação de contas.',
  },
]

/** Every area of an EJ has a screen here — the board needs to see itself. */
export const DIRECTORATE_PITCH: DirectoratePitch[] = [
  {
    directorate: 'presidency',
    text: 'Metas do ano contra o ritmo real e o consolidado de todas as áreas em uma tela.',
  },
  {
    directorate: 'commercial',
    text: 'Funil com origem, valor e motivo de perda, do primeiro contato ao contrato assinado.',
  },
  {
    directorate: 'marketing',
    text: 'A conversão por origem mostra onde vale gastar esforço e verba no próximo semestre.',
  },
  {
    directorate: 'projects',
    text: 'Quadro de projetos, alocação da equipe e o consumo de horas de cada contrato.',
  },
  {
    directorate: 'finance',
    text: 'Parcelas a receber e custos a pagar com data, vencidos em destaque e saldo do ano.',
  },
  {
    directorate: 'people',
    text: 'Quem é a equipe, o cargo de cada um na gestão e a carga que cada pessoa aguenta.',
  },
]

export const HOW_IT_WORKS_STEPS: ContentBlock[] = [
  {
    title: 'Abra a gestão do ano',
    text: 'Cada ano é uma gestão com metas próprias de faturamento, projetos, membros e satisfação. Todo número do sistema é lido dentro dela.',
  },
  {
    title: 'Registre a equipe e o funil',
    text: 'As pessoas atravessam as gestões; o cargo é registrado por gestão. As negociações entram no funil com origem e valor desde o primeiro contato.',
  },
  {
    title: 'Transforme contrato em projeto e alocação',
    text: 'Ganhou a proposta, abre-se o projeto com horas orçadas e a equipe recebe uma carga semanal — o planejado contra o qual o realizado será comparado.',
  },
  {
    title: 'A equipe lança as horas na própria semana',
    text: 'A semana é preenchida em uma grade, em segundos, sem fila de aprovação. Se lançar uma hora custar mais que isso, ninguém lança — e todo relatório depois vira ficção.',
  },
  {
    title: 'A diretoria decide com número',
    text: 'Metas contra o ritmo do ano, margem real por projeto, carga da equipe e fluxo de caixa — atualizados pelos próprios membros.',
  },
]

export const MENU_LINKS: MenuLink[] = [
  { href: '#solucao', label: 'O que resolve' },
  { href: '#recursos', label: 'Recursos' },
  { href: '#funciona', label: 'Como funciona' },
  { href: '#faq', label: 'Perguntas' },
]

/** Reassurance shown right under the hero buttons. */
export const HERO_ASSURANCES: string[] = [
  'Gratuito para empresas juniores',
  'Sem instalação, abre no navegador',
  'Nasceu dentro de uma EJ',
]

/**
 * Illustration of the system, fixed so the hero never depends on demo data —
 * and never changes shape when someone edits the demonstration.
 */
export const PREVIEW_METRICS: PreviewMetric[] = [
  { label: 'Faturamento contratado', value: 'R$ 23.500' },
  { label: 'Horas lançadas', value: '1.268 h' },
  { label: 'Hora real do projeto', value: 'R$ 28,93' },
]

export const BOARD_PREVIEW_COLUMNS: BoardPreviewColumn[] = [
  {
    status: 'planning',
    cards: [{ name: 'Landing page da campanha', stage: 'Kickoff agendado' }],
  },
  {
    status: 'inProgress',
    cards: [
      { name: 'Site institucional', stage: 'Revisão de conteúdo' },
      { name: 'App de vistoria', stage: 'Sprint 6 de 8' },
    ],
  },
  {
    status: 'delivered',
    cards: [{ name: 'Catálogo digital', stage: 'Contrato encerrado' }],
  },
]

/** Address shown in the fake browser bar of the preview. */
export const PREVIEW_ADDRESS = 'altotech.ej.br/app'
