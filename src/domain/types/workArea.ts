import type { Directorate } from './directorate'
import type { ID, IsoDate } from './common'

/**
 * An area of the enterprise, in the words that EJ uses for it.
 *
 * Two layers on purpose. The name is the tenant's: one EJ has a "Diretoria de
 * Gente e Gestão", another calls the same thing "RH", and a third splits it in
 * two. The `directorate` underneath is the fixed function the system actually
 * understands — it is what the permission rules read, so naming an area
 * "Financeiro Jr." cannot accidentally hand someone the cash ledger.
 *
 * Without the second layer, letting each EJ invent its areas would mean the
 * system no longer knows which of them is allowed to see money, and permissions
 * would collapse into the member's position alone.
 */
export interface WorkArea {
  id: ID
  enterpriseId: ID
  /** What this EJ calls the area. Shown everywhere a person's area is shown. */
  name: string
  /** The function it maps to. Fixed set: this is what grants permissions. */
  directorate: Directorate
  createdAt: IsoDate
}
