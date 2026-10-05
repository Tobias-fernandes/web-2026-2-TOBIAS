import type { Directorate } from "./directorate";
import type { ID, IsoDate } from "./common";

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
 *
 * An area answers to one function or several: one EJ runs commercial and
 * marketing as a single "Comercial e Marketing" directorate, another keeps them
 * apart. What an area may not do is share a function with another area of the
 * same EJ (`workAreaConflict`): every function has exactly one owner, so "who
 * directs finance" has one answer and the finance area is one area.
 */
export interface WorkArea {
  id: ID;
  enterpriseId: ID;
  /** What this EJ calls the area. Shown everywhere a person's area is shown. */
  name: string;
  /**
   * The functions it answers to — at least one. Fixed set: this is what grants
   * permissions, and a director of the area holds all of them.
   */
  directorates: Directorate[];
  createdAt: IsoDate;
}
