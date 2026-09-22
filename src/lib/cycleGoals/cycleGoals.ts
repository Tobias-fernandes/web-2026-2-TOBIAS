import { z } from 'zod'
import type { CycleGoals } from '@/domain/types'
import { fromCents, parseMoneyInput } from '@/lib/money'
import { zodValidate } from '@/lib/validation'

/** Text form of `CycleGoals` — what a goals form holds while it is being typed. */
export interface CycleGoalsFormState {
  revenueGoal: string
  projectsGoal: string
  membersGoal: string
  npsGoal: string
}

export const buildEmptyCycleGoalsForm = (): CycleGoalsFormState => ({
  revenueGoal: '',
  projectsGoal: '',
  membersGoal: '',
  npsGoal: '9',
})

export const cycleGoalsToForm = (goals: CycleGoals): CycleGoalsFormState => ({
  revenueGoal: String(fromCents(goals.revenueCents)),
  projectsGoal: String(goals.projects),
  membersGoal: String(goals.members),
  npsGoal: String(goals.npsScore),
})

export const cycleGoalsFromForm = (form: CycleGoalsFormState): CycleGoals => ({
  revenueCents: parseMoneyInput(form.revenueGoal) ?? 0,
  projects: Number(form.projectsGoal) || 0,
  members: Number(form.membersGoal) || 0,
  npsScore: Number(form.npsGoal) || 0,
})

/**
 * Goals stay blank until the board sets them — zero is a valid, unset state,
 * not a rejected one. What is rejected is garbage: negative numbers or a
 * satisfaction score outside its 0-10 scale.
 */
const cycleGoalsSchema = z.object({
  revenueGoal: z
    .string()
    .refine((value) => !value.trim() || (parseMoneyInput(value) ?? -1) >= 0, {
      message: 'A meta de faturamento não pode ser negativa.',
    }),
  projectsGoal: z
    .string()
    .refine((value) => Number(value) >= 0, { message: 'A meta de projetos não pode ser negativa.' }),
  membersGoal: z
    .string()
    .refine((value) => Number(value) >= 0, { message: 'A meta de membros não pode ser negativa.' }),
  npsGoal: z.string().refine((value) => Number(value) >= 0 && Number(value) <= 10, {
    message: 'A meta de satisfação vai de 0 a 10.',
  }),
})

export const validateCycleGoals = (form: CycleGoalsFormState): string | null =>
  zodValidate(cycleGoalsSchema, form)
