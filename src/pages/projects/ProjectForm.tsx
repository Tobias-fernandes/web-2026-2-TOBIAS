import { SelectField, TextAreaField, TextField } from '@/components/ui'
import { PROJECT_BOARD_COLUMNS, PROJECT_STATUS_LABELS } from '@/domain/constants'
import type { Client, Member, ProjectStatus } from '@/domain/types'
import type { ProjectFormState } from './types'

interface ProjectFormProps {
  value: ProjectFormState
  clients: Client[]
  members: Member[]
  onChange: (value: ProjectFormState) => void
}

/** Field set of the "new project" dialog, kept apart from the board itself. */
export function ProjectForm({
  value,
  clients,
  members,
  onChange,
}: ProjectFormProps) {
  const set = <K extends keyof ProjectFormState>(
    key: K,
    fieldValue: ProjectFormState[K],
  ) => onChange({ ...value, [key]: fieldValue })

  return (
    <>
      <TextField
        label="Nome do projeto"
        value={value.name}
        onChange={(event) => set('name', event.target.value)}
        placeholder="Site institucional"
      />

      <SelectField
        label="Cliente"
        value={value.clientId}
        onChange={(event) => set('clientId', event.target.value)}
        options={clients.map((client) => ({
          value: client.id,
          label: client.name,
        }))}
      />

      <SelectField
        label="Responsável"
        value={value.ownerId}
        onChange={(event) => set('ownerId', event.target.value)}
        options={members.map((member) => ({
          value: member.id,
          label: member.name,
        }))}
      />

      <TextAreaField
        label="Escopo"
        value={value.scope}
        onChange={(event) => set('scope', event.target.value)}
        placeholder="O que está contratado e o que não está."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Situação"
          value={value.status}
          onChange={(event) => set('status', event.target.value as ProjectStatus)}
          options={PROJECT_BOARD_COLUMNS.map((status) => ({
            value: status,
            label: PROJECT_STATUS_LABELS[status],
          }))}
        />
        <TextField
          label="Etapa"
          value={value.stage}
          onChange={(event) => set('stage', event.target.value)}
          placeholder="Sprint 1 de 4"
        />
        <TextField
          label="Valor do contrato (R$)"
          type="number"
          min={0}
          value={value.contractValue}
          onChange={(event) => set('contractValue', event.target.value)}
        />
        <TextField
          label="Horas estimadas"
          type="number"
          min={0}
          value={value.estimatedHours}
          onChange={(event) => set('estimatedHours', event.target.value)}
        />
        <TextField
          label="Prazo"
          type="date"
          value={value.dueAt}
          onChange={(event) => set('dueAt', event.target.value)}
        />
      </div>
    </>
  )
}
