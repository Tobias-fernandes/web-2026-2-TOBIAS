import type { Directorate } from '@/domain/types'
import type { CycleGoalsFormState } from '@/lib/cycleGoals'

export interface WorkAreaDraft {
  name: string
  /** The function that grants permissions; the name above is the EJ's own. */
  directorate: Directorate
}

export interface PresidentDraft {
  name: string
  email: string
  phone: string
  cpf: string
  registration: string
  entryTerm: string
  /** Names, not ids: neither the course nor the area exists yet. */
  course: string
  workArea: string
  avatarUrl: string | null
  password: string
  passwordConfirmation: string
}

export interface SignUpFormState {
  tradeName: string
  cnpj: string
  email: string
  courses: string[]
  workAreas: WorkAreaDraft[]
  /** Targets for the first management, opened the moment the EJ registers. */
  goals: CycleGoalsFormState
  president: PresidentDraft
}

/** Each step validates only what it asked for, so nobody is sent back twice. */
export interface SignUpStep {
  id: 'enterprise' | 'courses' | 'areas' | 'goals' | 'president'
  title: string
  description: string
  validate: (form: SignUpFormState) => string | null
}
