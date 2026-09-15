import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ClientForm } from './ClientForm'
import { EMPTY_CLIENT_FORM } from './constants'
import type { ClientFormState } from './types'

const meta = {
  title: 'Páginas/Clientes/ClientForm',
  component: ClientForm,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="flex max-w-lg flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: { value: EMPTY_CLIENT_FORM, onChange: fn() },
} satisfies Meta<typeof ClientForm>

export default meta
type Story = StoryObj<typeof meta>

export const Vazio: Story = {}

export const Preenchido: Story = {
  args: {
    value: {
      name: 'Padaria Pão de Ouro',
      taxId: '12.345.678/0001-90',
      contactName: 'Marta Albuquerque',
      email: 'contato@paodeouro.com.br',
      phone: '(84) 99612-4410',
      segment: 'Alimentício',
      status: 'active',
      notes: 'Indicação de ex-membro. Já contratou dois projetos.',
    },
  },
}

export const Interativo: Story = {
  render: (args) => {
    const [value, setValue] = useState<ClientFormState>(args.value)
    return <ClientForm {...args} value={value} onChange={setValue} />
  },
}
