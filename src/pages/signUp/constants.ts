import { buildEmptyCycleGoalsForm, validateCycleGoals } from '@/lib/cycleGoals'
import { validateNewPassword } from '@/lib/password'
import { zodValidate } from '@/lib/validation'
import { areasStepSchema, coursesStepSchema, enterpriseStepSchema, presidentStepSchema } from './schemas'
import type { SignUpFormState, SignUpStep } from './types'

/**
 * Areas an EJ is offered to start from.
 *
 * Suggestions, not a fixed list: the names can be changed and rows removed, and
 * what is kept is only the mapping underneath, which is what the permissions
 * read. An EJ that calls its people area "Gente e Gestão" should not have to
 * accept somebody else's vocabulary to use the system.
 */
export const SUGGESTED_WORK_AREAS: SignUpFormState['workAreas'] = [
  { name: 'Presidência', directorate: 'presidency' },
  { name: 'Comercial', directorate: 'commercial' },
  { name: 'Marketing', directorate: 'marketing' },
  { name: 'Gestão de Pessoas', directorate: 'people' },
  { name: 'Financeiro', directorate: 'finance' },
  { name: 'Projetos', directorate: 'projects' },
]

export const buildEmptySignUpForm = (): SignUpFormState => ({
  tradeName: '',
  cnpj: '',
  email: '',
  courses: [],
  workAreas: [...SUGGESTED_WORK_AREAS],
  goals: buildEmptyCycleGoalsForm(),
  president: {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    registration: '',
    entryTerm: '',
    course: '',
    workArea: '',
    avatarUrl: null,
    password: '',
    passwordConfirmation: '',
  },
})

export const SIGN_UP_STEPS: SignUpStep[] = [
  {
    id: 'enterprise',
    title: 'A empresa júnior',
    description: 'Como a EJ se chama e por onde ela responde oficialmente.',
    validate: (form) => zodValidate(enterpriseStepSchema, form),
  },
  {
    id: 'courses',
    title: 'Cursos',
    description:
      'De quais cursos a EJ aceita membros. Só alunos destes cursos podem ser cadastrados.',
    validate: (form) => zodValidate(coursesStepSchema, form),
  },
  {
    id: 'areas',
    title: 'Áreas de atuação',
    description:
      'Como a EJ se divide internamente. O nome é seu; a função ao lado é o que define o que cada área enxerga no sistema.',
    validate: (form) => zodValidate(areasStepSchema, form),
  },
  {
    id: 'goals',
    title: 'Metas da gestão',
    description:
      'O que a diretoria deste ano se compromete a entregar. Pode deixar em branco e ajustar depois — zero também é uma meta válida.',
    validate: (form) => validateCycleGoals(form.goals),
  },
  {
    id: 'president',
    title: 'Quem preside',
    description: 'Seus dados. Esta é a conta que vai administrar o sistema.',
    validate: (form) =>
      zodValidate(presidentStepSchema, form.president) ??
      validateNewPassword(form.president.password, form.president.passwordConfirmation),
  },
]
