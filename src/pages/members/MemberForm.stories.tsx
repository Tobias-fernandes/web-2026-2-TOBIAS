import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { buildEmptyMemberForm } from './constants'
import { MemberForm } from './MemberForm'
import type { MemberFormState } from './types'

const meta = {
  title: 'Páginas/Membros/MemberForm',
  component: MemberForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex max-w-lg flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: { value: buildEmptyMemberForm(), onChange: fn() },
} satisfies Meta<typeof MemberForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const Preenchido: Story = {
  args: {
    value: {
      name: 'Larissa Moura',
      email: 'larissa@altotech.ej.br',
      role: 'director',
      course: 'Engenharia de Software',
      status: 'active',
      weeklyHours: '10',
      joinedAt: '2025-02-10',
    },
  },
}

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<MemberFormState>(args.value)
    return <MemberForm {...args} value={value} onChange={setValue} />
  },
}
