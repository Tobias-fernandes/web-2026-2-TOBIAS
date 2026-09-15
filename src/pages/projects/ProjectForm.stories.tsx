import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { clientList, memberList } from '@/stories/fixtures'
import { EMPTY_PROJECT_FORM } from './constants'
import { ProjectForm } from './ProjectForm'
import type { ProjectFormState } from './types'

const meta = {
  title: 'Páginas/Projetos/ProjectForm',
  component: ProjectForm,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Conjunto de campos do diálogo "novo projeto". É controlado: recebe o estado e ' +
          'devolve o próximo por `onChange`, sem guardar nada por conta própria.',
      },
    },
  },
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
      ...EMPTY_PROJECT_FORM,
      clientId: clientList[0].id,
      ownerId: memberList[0].id,
    },
    clients: clientList,
    members: memberList,
  },
} satisfies Meta<typeof ProjectForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const Preenchido: Story = {
  args: {
    value: {
      name: 'Site institucional',
      clientId: clientList[0].id,
      ownerId: memberList[0].id,
      scope:
        'Site de cinco páginas com catálogo de produtos e formulário de encomenda.',
      stage: 'Sprint 1 de 4',
      status: 'inProgress',
      contractValue: '4800',
      estimatedHours: '120',
      dueAt: '2026-09-20',
    },
  },
}

/** Editável de verdade, para testar o fluxo de digitação. */
export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<ProjectFormState>(args.value)
    return <ProjectForm {...args} value={value} onChange={setValue} />
  },
}
