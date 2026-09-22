import type { Meta, StoryObj } from '@storybook/react-vite'
import type { CycleProgress } from '@/domain/types'
import { GoalProgressList } from './GoalProgressList'

const progress: CycleProgress = {
  cycleId: 'cyc-2026',
  cycleName: '2026',
  startsAt: '2026-02-02',
  endsAt: '2026-12-18',
  elapsed: 0.7,
  goals: [
    {
      label: 'Faturamento contratado',
      target: 3_800_000,
      current: 2_350_000,
      ratio: 2_350_000 / 3_800_000,
      format: 'money',
    },
    {
      label: 'Projetos fechados',
      target: 8,
      current: 5,
      ratio: 5 / 8,
      format: 'count',
    },
    {
      label: 'Membros na gestão',
      target: 14,
      current: 11,
      ratio: 11 / 14,
      format: 'count',
    },
    {
      label: 'Satisfação do cliente',
      target: 9,
      current: 10,
      ratio: 10 / 9,
      format: 'score',
    },
  ],
}

const meta = {
  title: 'Relatórios/GoalProgressList',
  component: GoalProgressList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Metas da gestão contra o ritmo do ano. A cor não vem de estar abaixo de ' +
          '100% — em março tudo está — e sim de estar atrás da fatia da gestão já ' +
          'percorrida, marcada pela linha vertical.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(520px,92vw)]">
        <Story />
      </div>
    ),
  ],
  args: { progress },
} satisfies Meta<typeof GoalProgressList>

export default meta
type Story = StoryObj<typeof meta>

export const NoRitmo: Story = {}

/** Fim da gestão com as metas atrasadas: quase tudo vira âmbar. */
export const AtrasadaNoFimDaGestao: Story = {
  args: {
    progress: {
      ...progress,
      elapsed: 0.94,
      goals: progress.goals.map((goal) => ({
        ...goal,
        current: goal.current * 0.5,
        ratio: goal.ratio * 0.5,
      })),
    },
  },
}

/** Gestão recém-aberta: nada foi feito ainda, e nada está atrasado. */
export const RecemAberta: Story = {
  args: {
    progress: {
      ...progress,
      elapsed: 0.05,
      goals: progress.goals.map((goal) => ({ ...goal, current: 0, ratio: 0 })),
    },
  },
}
