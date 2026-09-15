import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/Button'
import { Card, CardTitle } from './Card'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: 'Conteúdo do cartão.',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  render: (args) => (
    <Card {...args} className="max-w-md">
      <p className="m-0 text-sm text-tinta-suave">
        Superfície branca sobre o papel, usada em todos os blocos do sistema.
      </p>
    </Card>
  ),
}

/** Com o cabeçalho e uma ação alinhada à direita. */
export const ComTitulo: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardTitle action={<Button variant="subtle">Ver tudo</Button>}>
        Prazos mais próximos
      </CardTitle>
      <p className="m-0 text-sm text-tinta-suave">
        O título usa a fonte de display; a ação fica alinhada pela linha de base.
      </p>
    </Card>
  ),
}
