import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { courseList, workAreaList } from '@/stories/fixtures'
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
  args: {
    value: buildEmptyMemberForm(),
    cycleName: '2026',
    courses: courseList,
    workAreas: workAreaList,
    onChange: fn(),
  },
} satisfies Meta<typeof MemberForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const Preenchido: Story = {
  args: {
    value: {
      name: 'Larissa Moura',
      email: 'larissa@altotech.ej.br',
      phone: '(84) 98844-2210',
      cpf: '96001338914',
      registration: '2023011820',
      entryTerm: '2023.1',
      courseId: courseList[0].id,
      avatarUrl: null,
      status: 'active',
      joinedAt: '2025-02-10',
      role: 'vicePresident',
      workAreaId: workAreaList[0].id,
      weeklyHours: '12',
    },
  },
}

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<MemberFormState>(args.value)
    return <MemberForm {...args} value={value} onChange={setValue} />
  },
}
