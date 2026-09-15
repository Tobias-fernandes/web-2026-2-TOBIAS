import type { ContentBlock, FaqItem, MenuLink } from './types'

export const REPOSITORY_URL =
  'https://github.com/Tobias-fernandes/web-2026-2-TOBIAS'

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
      'É um sistema web de gestão para empresas juniores. Ele reúne em um só lugar o acompanhamento de projetos, o registro de horas dos membros, o cadastro de clientes e os números que a EJ precisa prestar de contas no fim da gestão.',
  },
  {
    question: 'Quem pode usar o sistema?',
    answer:
      'Qualquer empresa júnior, federada ou em processo de federação, e também núcleos de extensão e ligas acadêmicas que trabalham por projetos com equipes rotativas.',
  },
  {
    question: 'O AltoTech Manager é gratuito?',
    answer:
      'Sim. É um projeto acadêmico de código aberto, desenvolvido na disciplina de Desenvolvimento Web do Bacharelado em Tecnologia da Informação da UFERSA. O código está publicado no GitHub e pode ser usado e adaptado livremente.',
  },
  {
    question: 'Quais tecnologias são usadas no projeto?',
    answer:
      'A interface é uma aplicação React com Vite, TypeScript e Tailwind CSS, publicada como site estático no AWS Amplify. A camada de dados é isolada em serviços, preparada para consumir uma API na AWS. O repositório traz as instruções de instalação e a estrutura de pastas do sistema.',
  },
  {
    question: 'Como o sistema controla as horas dos membros?',
    answer:
      'Cada membro lança as horas dedicadas em um projeto e o total aparece consolidado por pessoa, por projeto e por período, o que ajuda a diretoria a enxergar sobrecarga e ociosidade antes que virem problema.',
  },
  {
    question: 'Como acompanho o andamento dos projetos?',
    answer:
      'Pelo painel de projetos, que mostra escopo, responsável, prazo e situação atual de cada contrato em execução, com o histórico do que já foi entregue.',
  },
]

export const PAIN_POINTS: ContentBlock[] = [
  {
    title: 'Projetos que ninguém sabe onde param',
    text: 'Cada contrato tem escopo, responsável, prazo e situação visíveis para a diretoria inteira, sem depender de quem participou da última reunião.',
  },
  {
    title: 'Horas lançadas de memória',
    text: 'O membro registra as horas no projeto em que trabalhou e o total aparece consolidado por pessoa e por período.',
  },
  {
    title: 'Prospecção espalhada no WhatsApp',
    text: 'Um cadastro único de contatos, propostas e status de negociação, que continua na EJ quando o diretor comercial sai.',
  },
  {
    title: 'Relatório da gestão feito na correria',
    text: 'Faturamento, número de projetos e horas por membro já somados, prontos para o relatório anual e para a prestação de contas.',
  },
]

export const HOW_IT_WORKS_STEPS: ContentBlock[] = [
  {
    title: 'Cadastre a empresa júnior e a equipe',
    text: 'Diretorias, membros e cargos são registrados uma vez e acompanham a EJ nas gestões seguintes.',
  },
  {
    title: 'Abra os projetos e vincule os clientes',
    text: 'Cada projeto recebe cliente, escopo, prazo e equipe responsável no momento em que o contrato é fechado.',
  },
  {
    title: 'Acompanhe tudo pelo painel',
    text: 'Horas, entregas e situação de cada contrato ficam visíveis em uma tela, atualizados pelos próprios membros.',
  },
]

export const MENU_LINKS: MenuLink[] = [
  { href: '#solucao', label: 'O que resolve' },
  { href: '#funciona', label: 'Como funciona' },
  { href: '#faq', label: 'Perguntas frequentes' },
]
