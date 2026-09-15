import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_TONES,
} from '@/domain/constants'
import type { ClientStatus, ProjectStatus } from '@/domain/types'
import { Badge } from './Badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Selo de estado. O tom vem de `PROJECT_STATUS_TONES` / `CLIENT_STATUS_TONES`, ' +
          'para que a mesma situação tenha sempre a mesma cor em todas as telas.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'inline-radio',
      options: ['neutral', 'violet', 'green', 'amber'],
    },
    children: { control: 'text' },
  },
  args: {
    children: 'Proposta enviada',
    tone: 'violet',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

/** Os quatro tons disponíveis, lado a lado. */
export const Tons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge tone="neutral">Neutro</Badge>
      <Badge tone="violet">Violeta</Badge>
      <Badge tone="green">Verde</Badge>
      <Badge tone="amber">Âmbar</Badge>
    </div>
  ),
}

/** Como cada situação de projeto aparece no painel. */
export const SituacoesDeProjeto: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map((status) => (
        <Badge key={status} tone={PROJECT_STATUS_TONES[status]}>
          {PROJECT_STATUS_LABELS[status]}
        </Badge>
      ))}
    </div>
  ),
}

/** Como cada situação de cliente aparece na tabela de prospecção. */
export const SituacoesDeCliente: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((status) => (
        <Badge key={status} tone={CLIENT_STATUS_TONES[status]}>
          {CLIENT_STATUS_LABELS[status]}
        </Badge>
      ))}
    </div>
  ),
}
