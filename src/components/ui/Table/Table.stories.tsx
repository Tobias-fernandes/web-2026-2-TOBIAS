import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/components/ui/Badge'
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_TONES } from '@/domain/constants'
import { formatDate } from '@/lib/format'
import { clientList } from '@/stories/fixtures'
import { Table, TableCell, TableRow } from './Table'

const meta = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A tabela vive dentro de um contêiner com `overflow-x: auto`, então colunas demais ' +
          'rolam na horizontal em vez de alargar a página.',
      },
    },
  },
  args: {
    headers: ['Cliente', 'Contato', 'Segmento', 'Situação', 'Desde'],
    children: null,
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Padrao: Story = {
  render: (args) => (
    <Table {...args}>
      {clientList.map((client) => (
        <TableRow key={client.id}>
          <TableCell>
            <p className="m-0 font-semibold">{client.name}</p>
            <p className="m-0 text-xs text-tinta-suave">
              {client.taxId ?? 'Sem CNPJ cadastrado'}
            </p>
          </TableCell>
          <TableCell>{client.contactName}</TableCell>
          <TableCell className="text-tinta-suave">{client.segment}</TableCell>
          <TableCell>
            <Badge tone={CLIENT_STATUS_TONES[client.status]}>
              {CLIENT_STATUS_LABELS[client.status]}
            </Badge>
          </TableCell>
          <TableCell className="whitespace-nowrap text-tinta-suave">
            {formatDate(client.createdAt)}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  ),
}

/** Uma linha só, para conferir o espaçamento vertical. */
export const LinhaUnica: Story = {
  render: (args) => (
    <Table {...args}>
      <TableRow>
        <TableCell className="font-semibold">Padaria Pão de Ouro</TableCell>
        <TableCell>Marta Albuquerque</TableCell>
        <TableCell className="text-tinta-suave">Alimentício</TableCell>
        <TableCell>
          <Badge tone="green">Ativo</Badge>
        </TableCell>
        <TableCell className="whitespace-nowrap text-tinta-suave">
          12/11/2025
        </TableCell>
      </TableRow>
    </Table>
  ),
}

/** Muitas colunas: o contêiner rola sem estourar a largura da página. */
export const ComRolagemHorizontal: Story = {
  args: {
    headers: [
      'Membro',
      'Cargo',
      'Curso',
      'Carga semanal',
      'Horas',
      'Situação',
      'Entrou em',
      'E-mail',
      'Telefone',
    ],
  },
  render: (args) => (
    <div className="max-w-2xl">
      <Table {...args}>
        <TableRow>
          <TableCell className="font-semibold">Tobias Fernandes</TableCell>
          <TableCell>Presidência</TableCell>
          <TableCell>Tecnologia da Informação</TableCell>
          <TableCell className="whitespace-nowrap">12 h/sem</TableCell>
          <TableCell className="font-display font-bold">25 h</TableCell>
          <TableCell>
            <Badge tone="green">Ativo</Badge>
          </TableCell>
          <TableCell className="whitespace-nowrap">05/08/2024</TableCell>
          <TableCell>tobias@altotech.ej.br</TableCell>
          <TableCell className="whitespace-nowrap">(84) 99612-4410</TableCell>
        </TableRow>
      </Table>
    </div>
  ),
}
