import type { Meta, StoryObj } from '@storybook/react-vite'
import type { HoursByCategory } from '@/domain/types'
import { CategoryBreakdown } from './CategoryBreakdown'

const rows: HoursByCategory[] = [
  { category: 'project', hours: 267, share: 0.55 },
  { category: 'commercial', hours: 55, share: 0.11 },
  { category: 'internal', hours: 134, share: 0.28 },
  { category: 'training', hours: 28, share: 0.06 },
  { category: 'event', hours: 0, share: 0 },
]

const meta = {
  title: 'Relatórios/CategoryBreakdown',
  component: CategoryBreakdown,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Para onde foram as horas da gestão. Quase metade do esforço de uma EJ não é ' +
          'hora de projeto — e um cronômetro que só aceita projeto faz esse trabalho ' +
          'desaparecer do relatório.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(460px,92vw)]">
        <Story />
      </div>
    ),
  ],
  args: { rows },
} satisfies Meta<typeof CategoryBreakdown>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

/** Gestão puxada por entregas: o trabalho interno encolhe. */
export const QuaseTudoProjeto: Story = {
  args: {
    rows: [
      { category: 'project', hours: 410, share: 0.86 },
      { category: 'commercial', hours: 28, share: 0.06 },
      { category: 'internal', hours: 30, share: 0.06 },
      { category: 'training', hours: 8, share: 0.02 },
      { category: 'event', hours: 0, share: 0 },
    ],
  },
}
