import type { IsoDate, TimeEntry, TimeEntryCategory } from '@/domain/types'
import { addDays, startOfWeek, todayIso } from '@/lib/date'

/**
 * Timesheet demo data, built relative to the day the app is first opened.
 *
 * Fixed dates would age out: within a month the weekly grid would be empty,
 * and the grid is the screen this data exists to show. So the recent weeks are
 * computed, and only the closed projects keep the absolute dates of when they
 * actually happened.
 */
const TODAY = todayIso()
const THIS_WEEK = startOfWeek(TODAY)

let sequence = 0

function entry(
  memberId: string,
  projectId: string | null,
  category: TimeEntryCategory,
  date: IsoDate,
  hours: number,
  description: string,
): TimeEntry {
  return {
    id: `tim-${String(++sequence).padStart(3, '0')}`,
    memberId,
    projectId,
    category,
    date,
    hours,
    description,
  }
}

/** Every Monday from the week of `from` up to the week of `to`, inclusive. */
function mondays(from: IsoDate, to: IsoDate): IsoDate[] {
  const weeks: IsoDate[] = []
  for (let week = startOfWeek(from); week <= startOfWeek(to); week = addDays(week, 7)) {
    weeks.push(week)
  }
  return weeks
}

/** Spreads a small, repeating variation over the weeks so no chart is a flat line. */
const VARIATION = [1, 0.75, 1.2, 0.9, 1.15]

interface ProjectLog {
  projectId: string
  members: string[]
  /** Hours the whole team logged on the project, spread across its weeks. */
  totalHours: number
  from: IsoDate
  to: IsoDate
  notes: string[]
}

function projectLog({
  projectId,
  members,
  totalHours,
  from,
  to,
  notes,
}: ProjectLog): TimeEntry[] {
  const weeks = mondays(from, to < TODAY ? to : TODAY)
  const perSlot = totalHours / (weeks.length * members.length)

  return weeks.flatMap((monday, weekIndex) =>
    members.flatMap((memberId, memberIndex) => {
      // Spread the team across weekdays, so the weekly grid is not one column.
      const date = addDays(monday, memberIndex % 5)
      if (date > TODAY || date > to) return []

      const hours =
        Math.round(perSlot * VARIATION[(weekIndex + memberIndex) % VARIATION.length] * 2) / 2
      if (hours <= 0) return []

      return [
        entry(
          memberId,
          projectId,
          'project',
          date,
          hours,
          notes[(weekIndex + memberIndex) % notes.length],
        ),
      ]
    }),
  )
}

/** Non-billable routine: board meetings, training, prospecting calls. */
function routineLog(
  memberId: string,
  category: TimeEntryCategory,
  hours: number,
  description: string,
  weekday: number,
  weeks: number,
): TimeEntry[] {
  return Array.from({ length: weeks }, (_, index) => {
    const date = addDays(addDays(THIS_WEEK, -7 * index), weekday)
    return date > TODAY ? null : entry(memberId, null, category, date, hours, description)
  }).filter((item): item is TimeEntry => item !== null)
}

export const SEED_TIME_ENTRIES: TimeEntry[] = [
  ...projectLog({
    projectId: 'prj-1',
    members: ['mem-5', 'mem-4', 'mem-6'],
    totalHours: 78,
    from: '2026-08-10',
    to: '2026-10-09',
    notes: [
      'Montagem das páginas internas',
      'Ajustes de layout no catálogo',
      'Integração do formulário de encomenda',
      'Revisão de textos com a cliente',
      'Testes de responsividade',
    ],
  }),
  ...projectLog({
    projectId: 'prj-2',
    members: ['mem-3', 'mem-11', 'mem-5'],
    totalHours: 402,
    from: '2026-03-09',
    to: '2026-11-28',
    notes: [
      'Sincronização offline dos formulários',
      'Captura e compressão de fotos',
      'Revisão do gerador de laudo',
      'Correções apontadas na sprint review',
      'Planejamento da sprint seguinte',
    ],
  }),
  ...projectLog({
    projectId: 'prj-3',
    members: ['mem-11', 'mem-3'],
    totalHours: 52,
    from: '2026-08-17',
    to: '2026-09-30',
    notes: [
      'Modelagem dos indicadores mensais',
      'Exportação para planilha',
      'Ajustes após a validação do cliente',
    ],
  }),
  ...projectLog({
    projectId: 'prj-5',
    members: ['mem-4', 'mem-6'],
    totalHours: 38,
    from: '2026-08-05',
    to: '2026-09-04',
    notes: ['Busca e filtros do catálogo', 'Fotografia e recorte dos produtos'],
  }),
  ...projectLog({
    projectId: 'prj-6',
    members: ['mem-1', 'mem-3'],
    totalHours: 128,
    from: '2025-02-17',
    to: '2025-05-27',
    notes: [
      'Consolidação das planilhas',
      'Geração do relatório mensal',
      'Treinamento da equipe do instituto',
    ],
  }),
  ...projectLog({
    projectId: 'prj-7',
    members: ['mem-2', 'mem-12'],
    totalHours: 71,
    from: '2025-03-10',
    to: '2025-06-09',
    notes: ['Integração com o meio de pagamento', 'Página de doação recorrente'],
  }),

  // Running the enterprise: the half of the hours a project-only timesheet hides.
  // These run the length of the management — a board meets every week of the
  // year, and a timesheet that only covers the last month makes the whole team
  // look idle against an annual commitment.
  ...routineLog('mem-1', 'internal', 3, 'Reunião de diretoria executiva', 0, 30),
  ...routineLog('mem-1', 'commercial', 2, 'Reuniões com clientes e federação', 3, 28),
  ...routineLog('mem-2', 'internal', 3, 'Reunião de diretoria executiva', 0, 30),
  ...routineLog('mem-2', 'training', 2, 'Planejamento da capacitação interna', 4, 26),
  ...routineLog('mem-3', 'internal', 2, 'Alinhamento semanal de projetos', 1, 29),
  ...routineLog('mem-8', 'internal', 3, 'Conciliação, contas a pagar e fechamento', 3, 29),
  ...routineLog('mem-9', 'internal', 2, 'Acompanhamento do processo seletivo', 2, 28),
  ...routineLog('mem-9', 'training', 2, 'Trilha de desenvolvimento dos trainees', 4, 24),
  ...routineLog('mem-10', 'commercial', 4, 'Follow-up de propostas e reuniões', 2, 29),
  ...routineLog('mem-4', 'internal', 2, 'Calendário editorial e redes sociais', 4, 29),
  ...routineLog('mem-5', 'internal', 1.5, 'Alinhamento semanal de projetos', 1, 26),
  ...routineLog('mem-11', 'training', 2, 'Capacitação técnica interna', 4, 24),
  ...routineLog('mem-7', 'commercial', 2, 'Levantamento de requisitos com a Vale Verde', 1, 10),
  // Beatriz entrou em agosto: a trilha dela começa onde a gestão já ia pela metade.
  ...routineLog('mem-6', 'commercial', 2, 'Prospecção ativa e qualificação de leads', 3, 6),
  ...routineLog('mem-6', 'training', 2, 'Trilha de capacitação de trainees', 4, 6),
]
