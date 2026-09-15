import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TextField } from './TextField'

const meta = {
  title: 'UI/Field/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'O `id` é gerado por `useId`, então o `<label>` sempre aponta para o campo certo ' +
          'mesmo com vários na mesma tela. Quando há `error`, o campo recebe `aria-invalid` ' +
          'e a dica dá lugar à mensagem.',
      },
    },
  },
  args: {
    onChange: fn(),
    label: 'Nome do projeto',
    placeholder: 'Site institucional',
  },
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComDica: Story = {
  args: { label: 'CNPJ', hint: 'Opcional para leads.' },
}

export const ComErro: Story = {
  args: {
    label: 'Senha',
    type: 'password',
    error: 'E-mail ou senha incorretos.',
  },
}

export const Data: Story = {
  args: { label: 'Prazo', type: 'date', placeholder: undefined },
}

export const Numero: Story = {
  args: {
    label: 'Valor do contrato (R$)',
    type: 'number',
    min: 0,
    placeholder: undefined,
  },
}

export const Busca: Story = {
  args: {
    label: 'Buscar',
    type: 'search',
    placeholder: 'Nome, contato ou segmento',
  },
}
