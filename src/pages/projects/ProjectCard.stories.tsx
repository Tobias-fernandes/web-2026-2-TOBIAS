import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  deliveredProject,
  inProgressProject,
  overdueProject,
  prospectingProject,
} from '@/stories/fixtures'
import { ProjectCard } from './ProjectCard'

const meta = {
  title: 'Páginas/Projetos/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Card do painel de projetos. O selo de prazo só aparece em contratos em execução, ' +
          'e o botão de avançar some na última coluna do funil.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ul className="m-0 max-w-xs list-none p-0">
        <Story />
      </ul>
    ),
  ],
  args: {
    onMove: fn(),
    project: inProgressProject,
    clientName: 'Padaria Pão de Ouro',
    ownerName: 'Tobias Fernandes',
    nextStatus: 'delivered',
    moving: false,
  },
} satisfies Meta<typeof ProjectCard>

export default meta
type Story = StoryObj<typeof meta>

export const EmExecucao: Story = {}

/** Prazo vencido: o selo passa a contar os dias de atraso. */
export const Atrasado: Story = {
  args: { project: overdueProject, clientName: 'Vistoria Norte Engenharia' },
}

/** Em prospecção não há selo de prazo — o contrato ainda não começou. */
export const EmProspeccao: Story = {
  args: {
    project: prospectingProject,
    clientName: 'Clínica Bem Viver',
    ownerName: 'Júlia Andrade',
    nextStatus: 'inProgress',
  },
}

/** Última coluna do funil: sem botão de avançar. */
export const Entregue: Story = {
  args: {
    project: deliveredProject,
    ownerName: 'Júlia Andrade',
    nextStatus: null,
  },
}

/** Enquanto a mutação do TanStack Query está pendente. */
export const Movendo: Story = {
  args: { moving: true },
}
