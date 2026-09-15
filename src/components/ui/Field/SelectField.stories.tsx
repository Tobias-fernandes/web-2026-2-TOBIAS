import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { MEMBER_ROLE_LABELS, PROJECT_STATUS_LABELS } from '@/domain/constants'
import type { MemberRole, ProjectStatus } from '@/domain/types'
import { memberList } from '@/stories/fixtures'
import { SelectField } from './SelectField'

const meta = {
  title: 'UI/Field/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    label: 'Cargo',
    options: (Object.keys(MEMBER_ROLE_LABELS) as MemberRole[]).map((role) => ({
      value: role,
      label: MEMBER_ROLE_LABELS[role],
    })),
  },
} satisfies Meta<typeof SelectField>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

/** Situações de projeto, como no formulário de novo contrato. */
export const SituacaoDoProjeto: Story = {
  args: {
    label: 'Situação',
    options: (Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[]).map(
      (status) => ({ value: status, label: PROJECT_STATUS_LABELS[status] }),
    ),
  },
}

/** Com a opção vazia em primeiro lugar — o padrão dos filtros. */
export const ComoFiltro: Story = {
  args: {
    label: 'Membro',
    options: [
      { value: '', label: 'Todos' },
      ...memberList.map((member) => ({
        value: member.id,
        label: member.name,
      })),
    ],
  },
}

export const ComErro: Story = {
  args: { error: 'Escolha um cargo.' },
}
