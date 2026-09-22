import { TextField } from '@/components/ui'
import { setField } from '@/lib/utils'
import type { CycleGoalsFieldsProps } from './types'

/** The four targets a management commits to. Shared by sign-up and the gestão screen. */
export function CycleGoalsFields({ value, onChange }: CycleGoalsFieldsProps) {
  const set = setField(value, onChange)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TextField
        label="Faturamento (R$)"
        inputMode="decimal"
        value={value.revenueGoal}
        placeholder="45000"
        onChange={(event) => set('revenueGoal', event.target.value)}
      />
      <TextField
        label="Projetos fechados"
        type="number"
        min={0}
        value={value.projectsGoal}
        onChange={(event) => set('projectsGoal', event.target.value)}
      />
      <TextField
        label="Membros na gestão"
        type="number"
        min={0}
        value={value.membersGoal}
        onChange={(event) => set('membersGoal', event.target.value)}
      />
      <TextField
        label="Satisfação do cliente (0 a 10)"
        type="number"
        min={0}
        max={10}
        step={0.5}
        value={value.npsGoal}
        onChange={(event) => set('npsGoal', event.target.value)}
      />
    </div>
  )
}
