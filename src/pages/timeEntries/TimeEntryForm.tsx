import { SelectField, TextField } from '@/components/ui'
import type { Member, Project } from '@/domain/types'
import { HOURS_STEP } from './constants'
import type { TimeEntryFormState } from './types'

interface TimeEntryFormProps {
  value: TimeEntryFormState
  members: Member[]
  projects: Project[]
  onChange: (value: TimeEntryFormState) => void
}

export function TimeEntryForm({
  value,
  members,
  projects,
  onChange,
}: TimeEntryFormProps) {
  const set = <K extends keyof TimeEntryFormState>(
    key: K,
    fieldValue: TimeEntryFormState[K],
  ) => onChange({ ...value, [key]: fieldValue })

  return (
    <>
      <SelectField
        label="Membro"
        value={value.memberId}
        onChange={(event) => set('memberId', event.target.value)}
        options={members.map((member) => ({
          value: member.id,
          label: member.name,
        }))}
      />
      <SelectField
        label="Projeto"
        value={value.projectId}
        onChange={(event) => set('projectId', event.target.value)}
        options={projects.map((project) => ({
          value: project.id,
          label: project.name,
        }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Data"
          type="date"
          value={value.date}
          onChange={(event) => set('date', event.target.value)}
        />
        <TextField
          label="Horas"
          type="number"
          min={HOURS_STEP}
          step={HOURS_STEP}
          value={value.hours}
          onChange={(event) => set('hours', event.target.value)}
          placeholder="4"
        />
      </div>
      <TextField
        label="Descrição"
        value={value.description}
        onChange={(event) => set('description', event.target.value)}
        placeholder="O que foi feito nessas horas."
      />
    </>
  )
}
