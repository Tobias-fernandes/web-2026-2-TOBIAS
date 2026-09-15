import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import {
  Button,
  EmptyState,
  Modal,
  Spinner,
  StatusSelect,
  Table,
  TableCell,
  TableRow,
  TextField,
} from '@/components/ui'
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_TONES } from '@/domain/constants'
import type { ClientStatus } from '@/domain/types'
import { formatDate } from '@/lib/format'
import {
  useClients,
  useCreateClient,
  useProjects,
  useUpdateClientStatus,
} from '@/queries'
import { ClientForm } from './ClientForm'
import { CLIENTS_TABLE_HEADERS, EMPTY_CLIENT_FORM } from './constants'
import type { ClientFormState } from './types'

const STATUS_OPTIONS = (Object.keys(CLIENT_STATUS_LABELS) as ClientStatus[]).map(
  (status) => ({ value: status, label: CLIENT_STATUS_LABELS[status] }),
)

export function ClientsPage() {
  const clients = useClients()
  const projects = useProjects()

  const createClient = useCreateClient()
  const updateStatus = useUpdateClientStatus()

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ClientFormState>(EMPTY_CLIENT_FORM)
  const [error, setError] = useState<string | null>(null)

  const term = search.trim().toLowerCase()

  const visibleClients = (clients.data ?? []).filter(
    (client) =>
      !term ||
      client.name.toLowerCase().includes(term) ||
      client.contactName.toLowerCase().includes(term) ||
      client.segment.toLowerCase().includes(term),
  )

  const projectCount = (clientId: string) =>
    (projects.data ?? []).filter((project) => project.clientId === clientId).length

  function openDialog() {
    setForm(EMPTY_CLIENT_FORM)
    setError(null)
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Informe ao menos o nome do cliente.')
      return
    }

    setError(null)

    try {
      await createClient.mutateAsync({
        ...form,
        name: form.name.trim(),
        taxId: form.taxId.trim() || null,
      })
      setOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.')
    }
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cadastro único de contatos, propostas e status de negociação — que continua na EJ quando a diretoria muda."
        action={<Button onClick={openDialog}>Novo cliente</Button>}
      />

      <div className="mb-5 max-w-md">
        <TextField
          label="Buscar"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nome, contato ou segmento"
        />
      </div>

      {clients.isPending && <Spinner label="Carregando clientes…" />}
      {clients.isError && (
        <p className="text-sm text-ambar">{clients.error.message}</p>
      )}

      {!clients.isPending && visibleClients.length === 0 && (
        <EmptyState
          title={term ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          description={
            term
              ? 'Tente outro termo de busca.'
              : 'Cadastre o primeiro contato para começar a acompanhar a prospecção.'
          }
          action={!term ? <Button onClick={openDialog}>Novo cliente</Button> : undefined}
        />
      )}

      {visibleClients.length > 0 && (
        <Table headers={CLIENTS_TABLE_HEADERS}>
          {visibleClients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <p className="m-0 font-semibold">{client.name}</p>
                <p className="m-0 text-[0.78rem] text-tinta-suave">
                  {client.taxId ?? 'Sem CNPJ cadastrado'}
                </p>
              </TableCell>
              <TableCell>
                <p className="m-0">{client.contactName}</p>
                <p className="m-0 text-[0.78rem] text-tinta-suave">{client.email}</p>
              </TableCell>
              <TableCell className="text-tinta-suave">{client.segment}</TableCell>
              <TableCell className="text-center font-display font-bold">
                {projectCount(client.id)}
              </TableCell>
              <TableCell>
                <StatusSelect
                  value={client.status}
                  tone={CLIENT_STATUS_TONES[client.status]}
                  accessibleLabel={`Situação de ${client.name}`}
                  options={STATUS_OPTIONS}
                  disabled={updateStatus.isPending}
                  onChange={(status) => updateStatus.mutate({ id: client.id, status })}
                />
              </TableCell>
              <TableCell className="whitespace-nowrap text-tinta-suave">
                {formatDate(client.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal open={open} title="Novo cliente" onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <ClientForm value={form} onChange={setForm} />

          {error && <p className="m-0 text-[0.85rem] text-ambar">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="subtle" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createClient.isPending}>
              {createClient.isPending ? 'Salvando…' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
