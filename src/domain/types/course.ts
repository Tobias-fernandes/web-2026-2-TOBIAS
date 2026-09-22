import type { ID, IsoDate } from './common'

/**
 * A degree course whose students may join the enterprise.
 *
 * Each EJ declares its own list when it registers — a computing EJ admits from
 * information technology and software engineering, an agronomy one from a set
 * that shares nothing with it. Members point at a course instead of typing one,
 * so "Eng. de Software" and "Engenharia de Software" cannot both exist and split
 * the same course in two on every report.
 *
 * Kept as its own record, rather than a list of strings on the enterprise, so
 * the screen that maintains it later is a CRUD like any other.
 */
export interface Course {
  id: ID
  enterpriseId: ID
  name: string
  createdAt: IsoDate
}
