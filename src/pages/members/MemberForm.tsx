import { SelectField, TextField } from '@/components/ui'
import { MEMBER_ROLE_LABELS } from '@/domain/constants'
import type { MemberRole } from '@/domain/types'
import type { MemberFormState } from './types'

interface MemberFormProps {
  value: MemberFormState
  onChange: (value: MemberFormState) => void
}

export function MemberForm({ value, onChange }: MemberFormProps) {
  const set = <K extends keyof MemberFormState>(
    key: K,
    fieldValue: MemberFormState[K],
  ) => onChange({ ...value, [key]: fieldValue })

  return (
    <>
      <TextField
        label="Nome completo"
        value={value.name}
        onChange={(event) => set('name', event.target.value)}
      />
      <TextField
        label="E-mail"
        type="email"
        value={value.email}
        onChange={(event) => set('email', event.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Cargo"
          value={value.role}
          onChange={(event) => set('role', event.target.value as MemberRole)}
          options={(Object.keys(MEMBER_ROLE_LABELS) as MemberRole[]).map((role) => ({
            value: role,
            label: MEMBER_ROLE_LABELS[role],
          }))}
        />
        <TextField
          label="Curso"
          value={value.course}
          onChange={(event) => set('course', event.target.value)}
        />
        <TextField
          label="Carga semanal (horas)"
          type="number"
          min={0}
          value={value.weeklyHours}
          onChange={(event) => set('weeklyHours', event.target.value)}
        />
        <TextField
          label="Entrou em"
          type="date"
          value={value.joinedAt}
          onChange={(event) => set('joinedAt', event.target.value)}
        />
      </div>
    </>
  )
}
