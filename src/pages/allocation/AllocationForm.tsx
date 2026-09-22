import { nameOptions, SelectField, TextField } from '@/components/ui'
import type { Member, Project } from '@/domain/types'
import { setField } from '@/lib/utils'
import type { AllocationFormState } from './types'

interface AllocationFormProps {
  value: AllocationFormState
  members: Member[]
  projects: Project[]
  onChange: (value: AllocationFormState) => void
}

export function AllocationForm({
  value,
  members,
  projects,
  onChange,
}: AllocationFormProps) {
  const set = setField(value, onChange)

  return (
    <>
      <SelectField
        label="Membro"
        value={value.memberId}
        onChange={(event) => set('memberId', event.target.value)}
        options={nameOptions(members)}
      />
      <SelectField
        label="Projeto"
        value={value.projectId}
        onChange={(event) => set('projectId', event.target.value)}
        options={nameOptions(projects)}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField
          label="Horas por semana"
          type="number"
          min={1}
          step={1}
          value={value.weeklyHours}
          onChange={(event) => set('weeklyHours', event.target.value)}
        />
        <TextField
          label="De"
          type="date"
          value={value.startsAt}
          onChange={(event) => set('startsAt', event.target.value)}
        />
        <TextField
          label="Até"
          type="date"
          value={value.endsAt}
          onChange={(event) => set('endsAt', event.target.value)}
        />
      </div>
    </>
  )
}
