import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { todayIso } from '@/lib/format'
import { memberList, projectList } from '@/stories/fixtures'
import { TimeEntryForm } from './TimeEntryForm'
import type { TimeEntryFormState } from './types'

const meta = {
  title: 'Páginas/Horas/TimeEntryForm',
  component: TimeEntryForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex max-w-lg flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    onChange: fn(),
    value: {
      memberId: memberList[0].id,
      projectId: projectList[0].id,
      date: todayIso(),
      hours: '',
      description: '',
    },
    members: memberList,
    projects: projectList,
  },
} satisfies Meta<typeof TimeEntryForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const Preenchido: Story = {
  args: {
    value: {
      memberId: memberList[1].id,
      projectId: projectList[1].id,
      date: '2026-09-10',
      hours: '4.5',
      description: 'Ajustes de layout no catálogo',
    },
  },
}

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<TimeEntryFormState>(args.value)
    return <TimeEntryForm {...args} value={value} onChange={setValue} />
  },
}
