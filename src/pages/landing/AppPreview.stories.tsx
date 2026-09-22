import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppPreview } from './AppPreview'

const meta = {
  title: 'Páginas/Landing/AppPreview',
  component: AppPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Retrato do sistema exibido na capa da landing. Carrega a própria cópia dos dados: ' +
          'a página pública não é autenticada, não deve chamar a API e não pode mudar de forma ' +
          'toda vez que alguém edita os dados de demonstração.',
      },
    },
  },
} satisfies Meta<typeof AppPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
}

/** Em telas estreitas as três colunas viram uma. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
