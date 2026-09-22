import type { ID, IsoDate } from "./common";

/** Funnel stages, in the order they appear on the commercial board. */
export type DealStage =
  "qualification" | "diagnosis" | "proposal" | "negotiation" | "won" | "lost";

/** Where the opportunity came from — the input of the conversion report. */
export type DealSource =
  "inbound" | "referral" | "event" | "outbound" | "university" | "other";

/** Why a deal was dropped. Recorded on loss so the funnel report can explain it. */
export type LossReason =
  "price" | "timing" | "scope" | "competitor" | "noResponse" | "other";

/**
 * An opportunity in the commercial funnel.
 *
 * Kept apart from `Client` because one client can bring several negotiations
 * over the years, and because a lost negotiation is data — it is what makes the
 * conversion rate and the loss reasons measurable instead of anecdotal.
 */
export interface Deal {
  id: ID;
  clientId: ID;
  cycleId: ID;
  title: string;
  /** Member responsible for the negotiation. */
  ownerId: ID;
  stage: DealStage;
  source: DealSource;
  valueCents: number;
  expectedCloseAt: IsoDate;
  closedAt: IsoDate | null;
  lossReason: LossReason | null;
  notes: string;
  createdAt: IsoDate;
}
