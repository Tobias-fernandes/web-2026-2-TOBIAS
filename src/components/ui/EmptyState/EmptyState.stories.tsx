import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'Nenhum projeto cadastrado',
    description:
      'Abra o primeiro contrato para começar a acompanhar prazos e horas.',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComAcao: Story = {
  args: { action: <Button>Novo projeto</Button> },
}

/** Sem descrição — usado quando o título já é suficiente. */
export const SoTitulo: Story = {
  args: { description: undefined },
}

/** Resultado de busca vazio: sem ação, porque o caminho é ajustar o filtro. */
export const BuscaSemResultado: Story = {
  args: {
    title: 'Nenhum cliente encontrado',
    description: 'Tente outro termo de busca.',
  },
}
