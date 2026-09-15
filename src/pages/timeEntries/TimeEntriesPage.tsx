import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout'
import {
  Button,
  EmptyState,
  Modal,
  Spinner,
  Table,
  TableCell,
  TableRow,
} from '@/components/ui'
import { formatDate, formatHours, todayIso } from '@/lib/format'
import {
  useCreateTimeEntry,
  useDeleteTimeEntry,
  useMembers,
  useProjects,
  useTimeEntries,
} from '@/queries'
import { useCurrentUser } from '@/stores/auth'
import { EMPTY_TIME_ENTRY_FILTER } from './constants'
import { TimeEntryFilters } from './TimeEntryFilters'
import { TimeEntryForm } from './TimeEntryForm'
import type { TimeEntryFilterState, TimeEntryFormState } from './types'

const TABLE_HEADERS = ['Data', 'Membro', 'Projeto', 'Descrição', 'Horas', '']

export function TimeEntriesPage() {
  const user = useCurrentUser()

  const members = useMembers()
  const projects = useProjects()

  const [filter, setFilter] = useState<TimeEntryFilterState>(
    EMPTY_TIME_ENTRY_FILTER,
  )

  // Empty strings are dropped so the query key stays stable and the repository
  // receives an absent filter rather than an empty one.
  const entries = useTimeEntries({
    memberId: filter.memberId || undefined,
    projectId: filter.projectId || undefined,
    from: filter.from || undefined,
    to: filter.to || undefined,
  })

  const createEntry = useCreateTimeEntry()
  const deleteEntry = useDeleteTimeEntry()

  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<TimeEntryFormState>({
    memberId: '',
    projectId: '',
    date: todayIso(),
    hours: '',
    description: '',
  })

  const memberName = (id: string) =>
    members.data?.find((member) => member.id === id)?.name ?? '—'

  const projectName = (id: string) =>
    projects.data?.find((project) => project.id === id)?.name ?? '—'

  const totalHours = useMemo(
    () => (entries.data ?? []).reduce((sum, entry) => sum + entry.hours, 0),
    [entries.data],
  )

  const sortedEntries = useMemo(
    () => [...(entries.data ?? [])].sort((a, b) => b.date.localeCompare(a.date)),
    [entries.data],
  )

  function openDialog() {
    setForm({
      // Defaults to the signed-in member: logging your own hours is the common case.
      memberId: user?.memberId ?? members.data?.[0]?.id ?? '',
      projectId: projects.data?.[0]?.id ?? '',
      date: todayIso(),
      hours: '',
      description: '',
    })
    setError(null)
    setOpen(true)
  }

  async function handleSave() {
    const hours = Number(form.hours)

    if (!form.memberId || !form.projectId || !(hours > 0)) {
      setError('Escolha o membro, o projeto e informe uma quantidade de horas.')
      return
    }

    setError(null)

    try {
      await createEntry.mutateAsync({
        memberId: form.memberId,
        projectId: form.projectId,
        date: form.date,
        hours,
        description: form.description.trim(),
      })
      setOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.')
    }
  }

  return (
    <>
      <PageHeader
        title="Horas"
        description="Lançamentos de horas por membro e por projeto, filtráveis por período."
        action={<Button onClick={openDialog}>Lançar horas</Button>}
      />

      <TimeEntryFilters
        value={filter}
        members={members.data ?? []}
        projects={projects.data ?? []}
        totalHours={totalHours}
        entryCount={sortedEntries.length}
        onChange={setFilter}
        onClear={() => setFilter(EMPTY_TIME_ENTRY_FILTER)}
      />

      {entries.isPending && <Spinner label="Carregando lançamentos…" />}
      {entries.isError && (
        <p className="text-sm text-ambar">{entries.error.message}</p>
      )}

      {!entries.isPending && sortedEntries.length === 0 && (
        <EmptyState
          title="Nenhum lançamento no período"
          description="Ajuste os filtros ou registre as horas dedicadas a um projeto."
          action={<Button onClick={openDialog}>Lançar horas</Button>}
        />
      )}

      {sortedEntries.length > 0 && (
        <Table headers={TABLE_HEADERS}>
          {sortedEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="whitespace-nowrap text-tinta-suave">
                {formatDate(entry.date)}
              </TableCell>
              <TableCell className="font-medium">
                {memberName(entry.memberId)}
              </TableCell>
              <TableCell>{projectName(entry.projectId)}</TableCell>
              <TableCell className="text-tinta-suave">{entry.description}</TableCell>
              <TableCell className="whitespace-nowrap font-display font-bold">
                {formatHours(entry.hours)}
              </TableCell>
              <TableCell className="text-right">
                <button
                  type="button"
                  disabled={deleteEntry.isPending}
                  onClick={() => deleteEntry.mutate(entry.id)}
                  className="rounded-[3px] px-2 py-1 text-[0.8rem] text-tinta-suave hover:text-ambar disabled:opacity-55"
                >
                  Excluir
                </button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}

      <Modal open={open} title="Lançar horas" onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <TimeEntryForm
            value={form}
            members={members.data ?? []}
            projects={projects.data ?? []}
            onChange={setForm}
          />

          {error && <p className="m-0 text-[0.85rem] text-ambar">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="subtle" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createEntry.isPending}>
              {createEntry.isPending ? 'Salvando…' : 'Lançar'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
