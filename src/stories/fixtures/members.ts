import type { Member } from '@/domain/types'

export const presidentMember: Member = {
  id: 'mem-1',
  name: 'Tobias Fernandes',
  email: 'tobias@altotech.ej.br',
  role: 'president',
  course: 'Tecnologia da Informação',
  status: 'active',
  joinedAt: '2024-08-05',
  weeklyHours: 12,
}

export const consultantMember: Member = {
  id: 'mem-4',
  name: 'Júlia Andrade',
  email: 'julia@altotech.ej.br',
  role: 'consultant',
  course: 'Design Digital',
  status: 'active',
  joinedAt: '2025-09-01',
  weeklyHours: 8,
}

export const onLeaveMember: Member = {
  id: 'mem-7',
  name: 'Vinícius Dantas',
  email: 'vinicius@altotech.ej.br',
  role: 'consultant',
  course: 'Administração',
  status: 'onLeave',
  joinedAt: '2025-04-22',
  weeklyHours: 8,
}

export const memberList: Member[] = [
  presidentMember,
  consultantMember,
  onLeaveMember,
]
