import type { Meta, StoryObj } from '@storybook/react-vite'
import { ProjectBoardPreview } from './ProjectBoardPreview'

const meta = {
  title: 'Páginas/Landing/ProjectBoardPreview',
  component: ProjectBoardPreview,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ilustração do painel exibida na capa da landing. Lê os dados de demonstração ' +
          'diretamente, porque a página pública não é autenticada e não deve chamar a API.',
      },
    },
  },
} satisfies Meta<typeof ProjectBoardPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
}

/** Em telas estreitas as três colunas viram uma. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
}
