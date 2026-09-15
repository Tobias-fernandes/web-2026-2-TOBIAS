import type { Session, User } from '@/domain/types'

export const presidentUser: User = {
  id: 'usr-1',
  name: 'Tobias Fernandes',
  email: 'tobias@altotech.ej.br',
  role: 'president',
  memberId: 'mem-1',
}

export const traineeUser: User = {
  id: 'usr-3',
  name: 'Beatriz Nogueira',
  email: 'beatriz@altotech.ej.br',
  role: 'trainee',
  memberId: 'mem-6',
}

export const buildSession = (user: User = presidentUser): Session => ({
  user,
  accessToken: `story.${user.id}`,
  expiresAt: Date.now() + 8 * 60 * 60 * 1000,
})
