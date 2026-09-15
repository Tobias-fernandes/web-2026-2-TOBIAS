import { useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Button, EmptyState, Modal, Spinner } from '@/components/ui'
import { PROJECT_BOARD_COLUMNS, PROJECT_STATUS_LABELS } from '@/domain/constants'
import type { ProjectStatus } from '@/domain/types'
import { todayIso } from '@/lib/format'
import {
  useChangeProjectStatus,
  useClients,
  useCreateProject,
  useMembers,
  useProjects,
} from '@/queries'
import { EMPTY_PROJECT_FORM } from './constants'
import { ProjectCard } from './ProjectCard'
import { ProjectForm } from './ProjectForm'
import type { ProjectFormState } from './types'

/** Next column in the funnel, used by the card's "move forward" button. */
function nextStatus(status: ProjectStatus): ProjectStatus | null {
  const index = PROJECT_BOARD_COLUMNS.indexOf(status)
  return index >= 0 && index < PROJECT_BOARD_COLUMNS.length - 1
    ? PROJECT_BOARD_COLUMNS[index + 1]
    : null
}

export function ProjectsPage() {
  const projects = useProjects()
  const clients = useClients()
  const members = useMembers()

  const createProject = useCreateProject()
  const changeStatus = useChangeProjectStatus()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<ProjectFormState>(EMPTY_PROJECT_FORM)
  const [error, setError] = useState<string | null>(null)

  const clientName = (id: string) =>
    clients.data?.find((client) => client.id === id)?.name ?? '—'

  const memberName = (id: string) =>
    members.data?.find((member) => member.id === id)?.name ?? '—'

  function openDialog() {
    setForm({
      ...EMPTY_PROJECT_FORM,
      clientId: clients.data?.[0]?.id ?? '',
      ownerId: members.data?.[0]?.id ?? '',
    })
    setError(null)
    setOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.clientId) {
      setError('Informe ao menos o nome do projeto e o cliente.')
      return
    }

    setError(null)

    try {
      await createProject.mutateAsync({
        name: form.name.trim(),
        clientId: form.clientId,
        ownerId: form.ownerId,
        teamIds: form.ownerId ? [form.ownerId] : [],
        scope: form.scope.trim(),
        status: form.status,
        stage: form.stage.trim() || PROJECT_STATUS_LABELS[form.status],
        contractValue: Number(form.contractValue) || 0,
        estimatedHours: Number(form.estimatedHours) || 0,
        startedAt: todayIso(),
        dueAt: form.dueAt || todayIso(),
        closedAt: null,
      })
      setOpen(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.')
    }
  }

  return (
    <>
      <PageHeader
        title="Projetos"
        description="Cada contrato com escopo, responsável, prazo e situação visíveis para a diretoria inteira."
        action={<Button onClick={openDialog}>Novo projeto</Button>}
      />

      {projects.isPending && <Spinner label="Carregando projetos…" />}
      {projects.isError && (
        <p className="text-sm text-ambar">{projects.error.message}</p>
      )}

      {projects.data?.length === 0 && (
        <EmptyState
          title="Nenhum projeto cadastrado"
          description="Abra o primeiro contrato para começar a acompanhar prazos e horas."
          action={<Button onClick={openDialog}>Novo projeto</Button>}
        />
      )}

      {projects.data && projects.data.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          {PROJECT_BOARD_COLUMNS.map((column) => {
            const columnProjects = projects.data.filter(
              (project) => project.status === column,
            )

            return (
              <section
                key={column}
                aria-label={PROJECT_STATUS_LABELS[column]}
                className="rounded-lg border border-linha bg-papel-alto p-3"
              >
                <div className="mb-3 flex items-baseline justify-between border-b border-linha px-1 pb-2">
                  <h2 className="font-sans text-[0.78rem] font-semibold tracking-wide text-tinta-suave uppercase">
                    {PROJECT_STATUS_LABELS[column]}
                  </h2>
                  <span className="text-[0.78rem] text-tinta-suave">
                    {columnProjects.length}
                  </span>
                </div>

                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                  {columnProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      clientName={clientName(project.clientId)}
                      ownerName={memberName(project.ownerId)}
                      nextStatus={nextStatus(project.status)}
                      moving={changeStatus.isPending}
                      onMove={(status) =>
                        changeStatus.mutate({ id: project.id, status })
                      }
                    />
                  ))}

                  {columnProjects.length === 0 && (
                    <li className="rounded-[6px] border border-dashed border-linha px-3 py-6 text-center text-[0.82rem] text-tinta-suave">
                      Nada aqui ainda.
                    </li>
                  )}
                </ul>
              </section>
            )
          })}
        </div>
      )}

      <Modal open={open} title="Novo projeto" onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-4">
          <ProjectForm
            value={form}
            clients={clients.data ?? []}
            members={members.data ?? []}
            onChange={setForm}
          />

          {error && <p className="m-0 text-[0.85rem] text-ambar">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="subtle" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createProject.isPending}>
              {createProject.isPending ? 'Salvando…' : 'Criar projeto'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
