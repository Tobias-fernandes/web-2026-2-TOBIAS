import type { CycleGoalsFormState } from '@/lib/cycleGoals'

export interface CycleGoalsFieldsProps {
  value: CycleGoalsFormState
  onChange: (next: CycleGoalsFormState) => void
}
