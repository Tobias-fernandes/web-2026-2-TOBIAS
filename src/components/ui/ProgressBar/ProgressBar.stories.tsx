import type { Meta, StoryObj } from '@storybook/react-vite'
import { formatMoney, formatPercent } from '@/lib/format'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  args: {
    ratio: 0.42,
    label: 'Faturamento contratado',
    value: formatMoney(1_900_000),
  },
  decorators: [
    (Story) => (
      <div className="w-[min(420px,90vw)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

/**
 * Com o marcador de ritmo: a linha vertical mostra quanto da gestão já passou,
 * então 42% da meta em uma gestão 30% percorrida é um resultado adiantado.
 */
export const ComRitmoDaGestao: Story = {
  args: {
    reference: 0.3,
    referenceLabel: '30% da gestão percorrida',
  },
}

export const MetaBatida: Story = {
  args: {
    ratio: 1.18,
    tone: 'green',
    value: formatPercent(1.18),
  },
}

export const Atencao: Story = {
  args: {
    ratio: 0.12,
    tone: 'amber',
    label: 'Membros na gestão',
    value: '2 de 14',
    reference: 0.6,
  },
}
