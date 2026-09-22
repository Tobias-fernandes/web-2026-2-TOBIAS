import type { Concept } from '../types'

export const CONCEPTS: Concept[] = [
  {
    term: 'Gestão (ou ciclo)',
    meaning:
      'O ano de uma diretoria, com metas próprias. Chamada pelo ano em que começou — ninguém batiza uma gestão. O fim só é registrado quando ela é encerrada, porque o dia da passagem de bastão não se sabe de antemão. Todo número do sistema é lido dentro de uma gestão, e é por isso que a virada de diretoria não apaga o passado.',
  },
  {
    term: 'Hora lançada',
    meaning:
      'Hora que o membro registrou na grade. Toda hora lançada conta — não há fila de aprovação. A folha aqui é um guia para a EJ enxergar onde o ano está indo, não um ponto: uma fila esperando assinatura de diretor só produz atraso e gente preenchendo a semana de memória na sexta.',
  },
  {
    term: 'Alocação × realizado',
    meaning:
      'Alocação é o que foi planejado (8 h por semana no projeto X); realizado é o que foi lançado. A diferença entre os dois é onde sobrecarga e ociosidade aparecem.',
  },
  {
    term: 'Hora real do projeto',
    meaning:
      'O valor do contrato dividido pelas horas que ele consumiu de verdade. Comparada com a hora orçada, diz se a EJ está vendendo barato demais.',
  },
  {
    term: 'Tipo de hora',
    meaning:
      'Projeto, gestão interna, capacitação, comercial ou evento. Sem essa separação, metade do trabalho de uma EJ fica invisível e a equipe parece ociosa.',
  },
  {
    term: 'Compromisso cancelado',
    meaning:
      'Reunião que não vai mais acontecer continua no calendário, riscada. Quem já tinha reservado a noite precisa ver o que houve com ela — compromisso que simplesmente some parece defeito, e a pessoa aparece assim mesmo.',
  },
  {
    term: 'Motivo de perda',
    meaning:
      'Por que uma negociação caiu. Registrado no fechamento, é o que transforma uma sequência de "não" em informação de preço, escopo ou timing.',
  },
]
