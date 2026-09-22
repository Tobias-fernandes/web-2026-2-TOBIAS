import type { RoutineItem } from '../types'

export const WEEKLY_ROUTINE: RoutineItem[] = [
  {
    when: 'Durante a semana',
    who: 'Todo membro',
    what: 'Clica no dia na grade e lança as horas do que fez. Leva segundos e evita a reconstituição de memória na sexta.',
  },
  {
    when: 'Sexta-feira',
    who: 'Todo membro',
    what: 'Dá uma última olhada na semana e completa o que ficou faltando. Ninguém vai cobrar — mas o relatório do ano é a soma disso.',
  },
  {
    when: 'Segunda-feira',
    who: 'Gerente de projeto',
    what: 'Confere o consumo de horas dos projetos em andamento contra o que foi orçado, e remaneja a alocação se um projeto estiver comendo mais do que devia.',
  },
  {
    when: 'Reunião semanal de diretoria',
    who: 'Diretoria executiva',
    what: 'Olha o painel: metas contra o ritmo do ano, prazos próximos, caixa e quem está sobrecarregado ou sem projeto.',
  },
  {
    when: 'Fim da gestão',
    who: 'Presidência',
    what: 'Imprime os relatórios, encerra a gestão e abre a próxima. Nada é apagado: o histórico é o que permite comparar diretorias.',
  },
]
