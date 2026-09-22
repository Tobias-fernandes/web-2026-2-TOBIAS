import type { Directorate } from "./directorate";
import type { ID, IsoDate } from "./common";

/** Money coming in (a contract instalment) or going out (a cost). */
export type FinanceKind = "receivable" | "payable";

export type FinanceCategory =
  | "projectInstalment"
  | "membershipFee"
  | "sponsorship"
  | "award"
  | "federationFee"
  | "tooling"
  | "event"
  | "training"
  | "tax"
  | "reimbursement"
  | "other";

/**
 * One line of the cash flow.
 *
 * Instalments rather than a single contract total: a project worth R$ 11.500
 * paid in three parts is three rows here, which is what makes the projected
 * cash flow real instead of a guess.
 *
 * A line does not need a project or a client. Plenty of an EJ's money has
 * nothing to do with a contract — the salgados for a coffee break, the prize
 * from a competition, the federation fee — and money that has no obvious place
 * to be registered is money that ends up in someone's notebook instead.
 */
export interface FinanceEntry {
  id: ID;
  cycleId: ID;
  kind: FinanceKind;
  category: FinanceCategory;
  description: string;
  amountCents: number;
  dueAt: IsoDate;
  /** Null while the line is still open; the date the money moved once settled. */
  paidAt: IsoDate | null;
  /** Set only when the line belongs to a contract. Most lines do not. */
  projectId: ID | null;
  clientId: ID | null;
  /**
   * The member the money passed through: who paid out of their own pocket and
   * is owed a reimbursement, or who received on the EJ's behalf. Null when it
   * moved straight through the enterprise's account.
   */
  memberId: ID | null;
  /**
   * Nota fiscal, recibo or wherever the proof lives — a number or a link.
   *
   * Free text rather than an upload: the file itself needs storage the system
   * does not have yet, and an EJ that has to account for the money needs to be
   * able to point at the paper today.
   */
  receiptRef: string;
  /** Which area owns the expense; receivables belong to finance. */
  directorate: Directorate;
  /** Member who registered the line — a junior enterprise has to account for it. */
  createdBy: ID | null;
  createdAt: IsoDate;
}
