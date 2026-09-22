import { SESSION_DURATION_MS } from '@/auth/services'
import { writeStoredSession } from '@/config/storage'
import type {
  Course,
  Cycle,
  JuniorEnterprise,
  Member,
  Membership,
  Session,
  User,
  WorkArea,
} from '@/domain/types'
import { todayIso } from '@/lib/date'
import { isValidCnpj, isValidCpf, onlyDigits } from '@/lib/document'
import { generateId } from '@/lib/utils'
import { findAccount, saveAccount } from '@/services/mock/accounts'
import { isCnpjRegistered, saveEnterprise } from '@/services/mock/enterprises'
import { writeCollection } from '@/services/mock/tenantStorage'
import { SignUpError } from './SignUpError'
import type { OnboardingService, SignUpInput } from './types'

const delay = (ms = 420) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Registering an enterprise, in the browser.
 *
 * Writes the whole tenant at once — enterprise, courses, areas, first cycle,
 * president and their position — and only then the credential that signs in,
 * so a registration that fails halfway leaves nothing anybody can log into.
 *
 * The real implementation is a single `POST /signup` handled in one
 * transaction; this exists so the flow can be walked before that endpoint does.
 */
export const mockOnboarding: OnboardingService = {
  async isCnpjTaken(cnpj: string) {
    await delay(200)
    return isCnpjRegistered(cnpj)
  },

  async signUp(input: SignUpInput): Promise<Session> {
    await delay()

    const cnpj = onlyDigits(input.enterprise.cnpj)
    const cpf = onlyDigits(input.president.cpf)

    if (!isValidCnpj(cnpj)) throw new SignUpError('CNPJ inválido.')
    if (!isValidCpf(cpf)) throw new SignUpError('CPF inválido.')
    if (isCnpjRegistered(cnpj)) {
      throw new SignUpError('Este CNPJ já tem uma empresa júnior cadastrada.')
    }
    if (findAccount(input.president.email)) {
      throw new SignUpError('Este e-mail já está em uso.')
    }
    if (input.courses.length === 0) {
      throw new SignUpError('Cadastre ao menos um curso.')
    }
    if (input.workAreas.length === 0) {
      throw new SignUpError('Cadastre ao menos uma área de atuação.')
    }

    const today = todayIso()
    const enterpriseId = generateId('ej')

    const enterprise: JuniorEnterprise = {
      id: enterpriseId,
      tradeName: input.enterprise.tradeName.trim(),
      cnpj,
      email: input.enterprise.email.trim(),
      createdAt: today,
    }

    const courses: Course[] = input.courses.map((name) => ({
      id: generateId('crs'),
      enterpriseId,
      name: name.trim(),
      createdAt: today,
    }))

    const workAreas: WorkArea[] = input.workAreas.map((area) => ({
      id: generateId('wka'),
      enterpriseId,
      name: area.name.trim(),
      directorate: area.directorate,
      createdAt: today,
    }))

    const course = courses.find((item) => item.name === input.president.course.trim())
    const workArea = workAreas.find(
      (item) => item.name === input.president.workArea.trim(),
    )
    if (!course) throw new SignUpError('Escolha o curso do presidente.')
    if (!workArea) throw new SignUpError('Escolha a área de atuação do presidente.')

    /**
     * The term the enterprise opens in. It exists from the first minute because
     * a position belongs to a management: without it the president would hold a
     * cargo in a term that does not exist, and every report would skip them.
     */
    const cycle: Cycle = {
      id: generateId('cyc'),
      startsAt: today,
      endsAt: null,
      status: 'active',
      goals: input.cycleGoals,
      createdAt: today,
    }

    const president: Member = {
      id: generateId('mem'),
      enterpriseId,
      name: input.president.name.trim(),
      email: input.president.email.trim(),
      phone: input.president.phone.trim(),
      cpf,
      registration: input.president.registration.trim(),
      entryTerm: input.president.entryTerm.trim(),
      courseId: course.id,
      avatarUrl: input.president.avatarUrl,
      // Active, not invited: nobody has to accept their own registration.
      status: 'active',
      joinedAt: today,
      leftAt: null,
      createdAt: today,
    }

    const membership: Membership = {
      id: generateId('msh'),
      memberId: president.id,
      cycleId: cycle.id,
      role: 'president',
      workAreaId: workArea.id,
      weeklyHours: 12,
      startsAt: today,
      endsAt: null,
      createdAt: today,
    }

    writeCollection('courses', courses, enterpriseId)
    writeCollection('work-areas', workAreas, enterpriseId)
    writeCollection('cycles', [cycle], enterpriseId)
    writeCollection('members', [president], enterpriseId)
    writeCollection('memberships', [membership], enterpriseId)

    const user: User = {
      id: generateId('usr'),
      enterpriseId,
      name: president.name,
      email: president.email,
      role: 'president',
      directorate: workArea.directorate,
      avatarUrl: president.avatarUrl,
      memberId: president.id,
    }

    saveAccount({
      id: user.id,
      enterpriseId,
      memberId: president.id,
      name: user.name,
      email: user.email,
      password: input.president.password,
    })

    // Written last, and in this order: `isCnpjTaken` reads the enterprise
    // register, so committing it before the credential exists would mark the
    // CNPJ as taken even if writing the account failed right after — locking
    // the EJ out of retrying its own registration. Everything up to here can
    // fail and leave nothing anybody could reach anyway.
    saveEnterprise(enterprise)

    const session: Session = {
      user,
      accessToken: `demo.${user.id}`,
      expiresAt: Date.now() + SESSION_DURATION_MS,
    }
    writeStoredSession(session)

    return session
  },
}
