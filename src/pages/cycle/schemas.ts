import { z } from 'zod'
import type { Cycle } from '@/domain/types'
import { todayIso } from '@/lib/date'

/**
 * Needs the siblings a gestão is being checked against, so it is built fresh
 * per submit rather than declared once — a plain schema has no way to see
 * "every other cycle this EJ already has".
 */
export const buildCycleFormSchema = (others: Cycle[]) =>
  z
    .object({
      startsAt: z.string().min(1, 'Informe o dia em que a diretoria assumiu.'),
      status: z.enum(['planned', 'active', 'closed']),
    })
    .superRefine((form, ctx) => {
      // Encerrar carimba o dia de hoje, e uma gestão que ainda não começou
      // terminaria antes de começar.
      if (form.status === 'closed' && form.startsAt > todayIso()) {
        ctx.addIssue('Uma gestão que ainda não começou não pode ser encerrada.')
        return
      }

      // A gestão é anual e nomeada pelo ano de início (`describeCycle`), então
      // duas com o mesmo ano seriam duas gestões com o mesmo nome — e uma
      // segunda "em andamento" deixaria `useActiveCycle` escolhendo entre elas
      // sem nenhum critério que faça sentido para quem está lendo o dashboard.
      const year = form.startsAt.slice(0, 4)
      if (others.some((item) => item.startsAt.slice(0, 4) === year)) {
        ctx.addIssue(`Já existe uma gestão de ${year}.`)
        return
      }
      if (form.status === 'active' && others.some((item) => item.status === 'active')) {
        ctx.addIssue('Já existe uma gestão em andamento. Encerre-a antes de abrir outra.')
      }
    })
