import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  MEMBER_STATUS_LABELS,
  MEMBER_STATUS_TONES,
} from '@/domain/constants'
import type { ClientStatus, MemberStatus } from '@/domain/types'
import { StatusSelect } from './StatusSelect'

const CLIENT_OPTIONS = (Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map(
  (status) => ({ value: status, label: CLIENT_STATUS_LABELS[status] }),
)

const meta = {
  title: 'UI/StatusSelect',
  component: StatusSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Situação editável direto na linha da tabela. O próprio select carrega a cor do ' +
          'estado, então não é preciso repetir a informação em um selo ao lado.',
      },
    },
  },
  args: {
    value: 'active',
    tone: 'green',
    accessibleLabel: 'Situação de Padaria Pão de Ouro',
    options: CLIENT_OPTIONS,
    onChange: fn(),
  },
} satisfies Meta<typeof StatusSelect<ClientStatus>>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const Desabilitado: Story = {
  args: { disabled: true },
}

/** Troca de verdade: o tom acompanha o valor escolhido. */
export const Interativo: Story = {
  render: (args) => {
    const [status, setStatus] = useState<ClientStatus>('lead')

    return (
      <StatusSelect<ClientStatus>
        {...args}
        value={status}
        options={CLIENT_OPTIONS}
        tone={CLIENT_STATUS_TONES[status]}
        onChange={setStatus}
      />
    )
  },
}

/** Todas as situações de cliente, para comparar as cores. */
export const SituacoesDeCliente: Story = {
  render: (args) => (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map((status) => (
        <StatusSelect<ClientStatus>
          {...args}
          key={status}
          value={status}
          options={CLIENT_OPTIONS}
          tone={CLIENT_STATUS_TONES[status]}
        />
      ))}
    </div>
  ),
}

/** As situações de membro usam o mesmo componente. */
export const SituacoesDeMembro: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]).map((status) => (
        <StatusSelect<MemberStatus>
          key={status}
          value={status}
          tone={MEMBER_STATUS_TONES[status]}
          accessibleLabel={`Situação de Tobias Fernandes`}
          options={(Object.keys(MEMBER_STATUS_LABELS) as MemberStatus[]).map(
            (option) => ({ value: option, label: MEMBER_STATUS_LABELS[option] }),
          )}
          onChange={fn()}
        />
      ))}
    </div>
  ),
}
