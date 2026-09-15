import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TextAreaField } from './TextAreaField'

const meta = {
  title: 'UI/Field/TextAreaField',
  component: TextAreaField,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    label: 'Escopo',
    placeholder: 'O que está contratado e o que não está.',
  },
} satisfies Meta<typeof TextAreaField>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {}

export const ComValor: Story = {
  args: {
    defaultValue:
      'Site institucional de cinco páginas com catálogo de produtos, formulário de encomenda e integração com o WhatsApp da padaria.',
  },
}

export const ComErro: Story = {
  args: { error: 'Descreva o escopo antes de salvar.' },
}
