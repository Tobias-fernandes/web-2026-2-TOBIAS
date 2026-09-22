import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { CalendarEvent, EventKind, IsoDate } from '@/domain/types'
import { isSameMonth, monthGrid } from '@/lib/date'
import type { CalendarDay } from './types'
import { MonthGrid } from './MonthGrid'

const MONTH = '2026-09-01'
const TODAY = '2026-09-15'
const SELECTED = '2026-09-21'

function event(
  id: string,
  title: string,
  kind: EventKind,
  startsAt: IsoDate,
  extra: Partial<CalendarEvent> = {},
): CalendarEvent {
  return {
    id,
    cycleId: 'cyc-2026',
    title,
    kind,
    directorate: 'presidency',
    audience: 'enterprise',
    startsAt,
    endsAt: startsAt,
    allDay: false,
    startTime: '19:00',
    endTime: '20:30',
    location: 'Sala da EJ',
    onlineUrl: null,
    description: '',
    projectId: null,
    status: 'scheduled',
    createdBy: 'mem-1',
    createdAt: '2026-08-20',
    ...extra,
  }
}

const EVENTS: CalendarEvent[] = [
  event('e1', 'Reunião de diretoria', 'meeting', '2026-09-07'),
  event('e2', 'Alinhamento de projetos', 'meeting', '2026-09-09', {
    startTime: '18:30',
    endTime: '19:30',
  }),
  event('e3', 'Capacitação: proposta comercial', 'training', '2026-09-10', {
    endTime: '21:00',
  }),
  event('e4', 'Visita técnica ao cliente', 'commercial', '2026-09-16', {
    startTime: '14:00',
    endTime: '16:00',
  }),
  event('e5', 'Semana do processo seletivo', 'selection', '2026-09-21', {
    endsAt: '2026-09-25',
    allDay: true,
    startTime: null,
    endTime: null,
  }),
  event('e6', 'Reunião de diretoria', 'meeting', '2026-09-21', {
    status: 'cancelled',
  }),
  event('e7', 'Reunião geral de membros', 'meeting', '2026-09-24'),
  event('e8', 'Integração de novos membros', 'social', '2026-09-26', {
    startTime: '18:00',
    endTime: '22:00',
  }),
]

const DEADLINES: Record<string, string> = {
  '2026-09-30': 'Painel de indicadores da frota',
}

function buildDays(events: CalendarEvent[]): CalendarDay[] {
  return monthGrid(MONTH).map((date) => ({
    date,
    inMonth: isSameMonth(date, MONTH),
    isToday: date === TODAY,
    isSelected: date === SELECTED,
    events: events.filter(
      (item) => item.startsAt <= date && item.endsAt >= date,
    ),
    deadlines: DEADLINES[date]
      ? [{ projectId: 'prj-3', name: DEADLINES[date] }]
      : [],
  }))
}

const meta = {
  title: 'Páginas/Calendário/MonthGrid',
  component: MonthGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'O mês da gestão. A célula inteira é um botão só — um calendário que ' +
          'empilha três alvos clicáveis em um quadrado de cem pixels é um ' +
          'calendário em que se abre a coisa errada —, e escolher o dia enche o ' +
          'painel ao lado, que é onde o compromisso pode de fato ser lido e ' +
          'alterado. Entregas de projeto entram tracejadas: a data pertence ao ' +
          'projeto, e aqui ela só é desenhada.',
      },
    },
  },
  args: { days: buildDays(EVENTS), onSelect: fn() },
} satisfies Meta<typeof MonthGrid>

export default meta
type Story = StoryObj<typeof meta>

export const MesCheio: Story = {}

/** Mês sem nada marcado — o estado do primeiro dia de uma gestão nova. */
export const MesVazio: Story = {
  args: { days: buildDays([]) },
}

/** A semana do processo seletivo aparece nos cinco dias que ela ocupa. */
export const CompromissoDeVariosDias: Story = {
  args: { days: buildDays(EVENTS.filter((item) => item.id === 'e5')) },
}

/** Dia lotado: as três primeiras etiquetas cabem, o resto vira contagem. */
export const DiaComExcesso: Story = {
  args: {
    days: buildDays([
      ...EVENTS,
      event('e9', 'Mentoria com a federação', 'external', '2026-09-21', {
        startTime: '16:00',
        endTime: '17:00',
      }),
      event('e10', 'Fechamento do mês', 'deadline', '2026-09-21', {
        allDay: true,
        startTime: null,
        endTime: null,
      }),
    ]),
  },
}
