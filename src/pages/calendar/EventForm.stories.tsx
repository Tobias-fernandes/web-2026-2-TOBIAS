import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { projectList } from '@/stories/fixtures'
import { EventForm } from './EventForm'
import type { EventFormState } from './types'

const EMPTY: EventFormState = {
  title: '',
  kind: 'meeting',
  directorate: 'presidency',
  audience: 'enterprise',
  startsAt: '2026-09-18',
  endsAt: '2026-09-18',
  allDay: false,
  startTime: '19:00',
  endTime: '20:30',
  location: '',
  onlineUrl: '',
  projectId: '',
  description: '',
}

const meta = {
  title: 'Páginas/Calendário/EventForm',
  component: EventForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex max-w-lg flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: { onChange: fn(), value: EMPTY, projects: projectList },
} satisfies Meta<typeof EventForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const ReuniaoDeDiretoria: Story = {
  args: {
    value: {
      ...EMPTY,
      title: 'Reunião de diretoria executiva',
      audience: 'directorate',
      location: 'Sala da EJ — Bloco IV, UFERSA',
      onlineUrl: 'https://meet.google.com/altotech-diretoria',
      description: 'Pauta fixa: funil, projetos, caixa e pessoas.',
    },
  },
}

/** Marcar "dia todo" tira os dois campos de horário do formulário. */
export const DiaTodo: Story = {
  args: {
    value: {
      ...EMPTY,
      title: 'Semana do processo seletivo',
      kind: 'selection',
      directorate: 'people',
      endsAt: '2026-09-25',
      allDay: true,
      location: 'Campus Pau dos Ferros',
    },
  },
}

/** Compromisso ligado a um projeto: kickoff, checkpoint ou entrega. */
export const LigadoAUmProjeto: Story = {
  args: {
    value: {
      ...EMPTY,
      title: 'Entrega e treinamento do cliente',
      kind: 'deadline',
      directorate: 'projects',
      projectId: projectList[0].id,
      location: 'Remoto',
    },
  },
}

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<EventFormState>(args.value)
    return <EventForm {...args} value={value} onChange={setValue} />
  },
}
