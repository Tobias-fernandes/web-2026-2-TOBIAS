import { CycleGoalsFields } from '@/components/forms'
import type { SignUpFormState } from '../types'

interface StepProps {
  value: SignUpFormState
  onChange: (value: SignUpFormState) => void
}

export function GoalsStep({ value, onChange }: StepProps) {
  return (
    <CycleGoalsFields
      value={value.goals}
      onChange={(goals) => onChange({ ...value, goals })}
    />
  )
}
