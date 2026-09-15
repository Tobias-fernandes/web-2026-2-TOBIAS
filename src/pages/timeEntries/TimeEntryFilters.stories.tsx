import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { memberList, projectList } from '@/stories/fixtures'
import { EMPTY_TIME_ENTRY_FILTER } from './constants'
import { TimeEntryFilters } from './TimeEntryFilters'
import type { TimeEntryFilterState } from './types'

const meta = {
  title: 'Páginas/Horas/TimeEntryFilters',
  component: TimeEntryFilters,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Filtros da tela de horas. O total exibido é o somatório do que a consulta devolveu, ' +
          'não o cadastro inteiro — por isso ele vem por prop em vez de ser calculado aqui.',
      },
    },
  },
  args: {
    onChange: fn(),
    onClear: fn(),
    value: EMPTY_TIME_ENTRY_FILTER,
    members: memberList,
    projects: projectList,
    totalHours: 125,
    entryCount: 18,
  },
} satisfies Meta<typeof TimeEntryFilters>

export default meta
type Story = StoryObj<typeof meta>

export const SemFiltro: Story = {}

export const ComFiltroAplicado: Story = {
  args: {
    value: {
      memberId: memberList[0].id,
      projectId: '',
      from: '2026-09-01',
      to: '2026-09-30',
    },
    totalHours: 25,
    entryCount: 4,
  },
}

/** Filtro que não devolveu nada. */
export const SemResultado: Story = {
  args: {
    value: { memberId: '', projectId: '', from: '2027-01-01', to: '2027-01-31' },
    totalHours: 0,
    entryCount: 0,
  },
}

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<TimeEntryFilterState>(args.value)
    return (
      <TimeEntryFilters
        {...args}
        value={value}
        onChange={setValue}
        onClear={() => setValue(EMPTY_TIME_ENTRY_FILTER)}
      />
    )
  },
}
