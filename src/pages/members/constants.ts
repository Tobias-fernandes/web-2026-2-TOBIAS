import { todayIso } from '@/lib/format'
import type { MemberFormState } from './types'

export const buildEmptyMemberForm = (): MemberFormState => ({
  name: '',
  email: '',
  role: 'trainee',
  course: '',
  status: 'active',
  weeklyHours: '8',
  joinedAt: todayIso(),
})

export const MEMBERS_TABLE_HEADERS = [
  'Membro',
  'Cargo',
  'Curso',
  'Carga semanal',
  'Horas',
  'Situação',
  'Entrou em',
]
