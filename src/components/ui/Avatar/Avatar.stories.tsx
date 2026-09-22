import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Identificação de uma pessoa. Sem foto, cai nas iniciais em vez de uma silhueta ' +
          'genérica: em uma EJ quase ninguém envia retrato, e uma coluna de bonecos ' +
          'cinzentos diz menos ao leitor do que duas letras.',
      },
    },
  },
  args: { name: 'Tobias Fernandes' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Iniciais: Story = {}

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
}

/** Com foto — a URL vem da claim `picture` do token de identidade. */
export const ComFoto: Story = {
  args: {
    src:
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="%235b34d9"/><circle cx="32" cy="24" r="12" fill="%23fff"/><path d="M8 64c0-14 11-22 24-22s24 8 24 22z" fill="%23fff"/></svg>',
      ),
    size: 'lg',
  },
}

/** Um nome só ainda rende uma inicial. */
export const NomeCurto: Story = {
  args: { name: 'Beatriz' },
}
