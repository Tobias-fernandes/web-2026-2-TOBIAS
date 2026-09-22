import { DEMO_ENTERPRISE_ID } from '@/config/storage'
import type { Course, Directorate, JuniorEnterprise, WorkArea } from '@/domain/types'

/**
 * The enterprise the whole demo belongs to.
 *
 * Everything seeded — members, projects, money, the calendar — sits inside this
 * one tenant. An EJ that registers through the form gets an id of its own and
 * opens an empty system, which is what makes the demo honest: the two never
 * share a record.
 */
export const DEMO_ENTERPRISE: JuniorEnterprise = {
  id: DEMO_ENTERPRISE_ID,
  tradeName: 'AltoTech Juniors',
  cnpj: '11222333000181',
  email: 'contato@altotech.ej.br',
  createdAt: '2024-08-05',
}

/** Courses this EJ admits from. The seeded members all study one of these. */
export const SEED_COURSES: Course[] = [
  'Tecnologia da Informação',
  'Engenharia de Software',
  'Engenharia de Computação',
  'Design Digital',
  'Administração',
  'Ciências Contábeis',
  'Psicologia',
].map((name, index) => ({
  id: `crs-${index + 1}`,
  enterpriseId: DEMO_ENTERPRISE_ID,
  name,
  createdAt: DEMO_ENTERPRISE.createdAt,
}))

export const COURSE_ID_BY_NAME: Record<string, string> = Object.fromEntries(
  SEED_COURSES.map((course) => [course.name, course.id]),
)

/**
 * This EJ's areas, one per function.
 *
 * A demo with a one-to-one mapping is the simplest thing to read, but the shape
 * does not require it: an EJ is free to run two areas that both answer to
 * `projects`, or to name none of them the way this one does.
 */
const AREA_NAMES: Record<Directorate, string> = {
  presidency: 'Presidência',
  commercial: 'Comercial',
  marketing: 'Marketing',
  people: 'Gestão de Pessoas',
  finance: 'Financeiro',
  projects: 'Gestão de Projetos',
}

export const SEED_WORK_AREAS: WorkArea[] = (
  Object.keys(AREA_NAMES) as Directorate[]
).map((directorate) => ({
  id: `wka-${directorate}`,
  enterpriseId: DEMO_ENTERPRISE_ID,
  name: AREA_NAMES[directorate],
  directorate,
  createdAt: DEMO_ENTERPRISE.createdAt,
}))

export const WORK_AREA_ID_BY_DIRECTORATE = Object.fromEntries(
  SEED_WORK_AREAS.map((area) => [area.directorate, area.id]),
) as Record<Directorate, string>
